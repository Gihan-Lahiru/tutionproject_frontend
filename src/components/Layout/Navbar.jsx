import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBell, FiDownload, FiSmartphone, FiExternalLink } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { resolveAssetUrl } from '../../utils/dashboardUtils';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const knownNotificationIdsRef = useRef(new Set());
  const notificationsInitializedRef = useRef(false);
  const announcedNotificationIdsRef = useRef(new Set());
  const { user } = useContext(AuthContext);
  const { openLogin, openRegister } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  const isPaymentReminderNotification = (notification) => {
    const type = String(notification?.type || '').toLowerCase();
    const msg = String(notification?.message || '').toLowerCase();
    return type === 'payment' && msg.includes('payment reminder');
  };

  const normalizeNotifications = (data) => {
    const items = Array.isArray(data) ? data : (data?.notifications || []);

    return items.map((notification) => ({
      ...notification,
      unread: Boolean(notification?.unread ?? Number(notification?.read) === 0),
      created_at: notification?.created_at || notification?.createdAt || notification?.createdAtDate || notification?.created,
    }));
  };

  // Check if we're on a dashboard page (include root paths like '/student' and '/teacher')
  const isDashboard = location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher');

  const getProfileImageSrc = (value) => resolveAssetUrl(value);

  // Fetch real notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && isDashboard) {
        try {
          const response = await api.get('/notifications/my-notifications');
          const nextNotifications = normalizeNotifications(response.data);
          setNotifications(nextNotifications);
          setUnreadCount(nextNotifications.filter((notification) => notification.unread).length);

          // First fetch seeds known IDs.
          if (!notificationsInitializedRef.current) {
            knownNotificationIdsRef.current = new Set(nextNotifications.map((n) => n.id));
            notificationsInitializedRef.current = true;
            return;
          }

          const newUnread = nextNotifications.filter(
            (n) => n.unread && !knownNotificationIdsRef.current.has(n.id) && !announcedNotificationIdsRef.current.has(n.id)
          );

          newUnread.slice(0, 3).forEach((n) => {
            const type = String(n.type || '').toLowerCase();
            
            // Show receipt pending approval as success/info
            if (type === 'receipt_pending_approval') {
              toast.info(n.message, {
                position: 'top-right',
                autoClose: 6000,
                closeOnClick: true,
              });
            } else if (isPaymentReminderNotification(n)) {
              toast.error(n.message, {
                position: 'top-right',
                autoClose: 5000,
                closeOnClick: true,
              });
            } else {
              toast.info(n.message, {
                position: 'top-right',
                autoClose: 5000,
                closeOnClick: true,
              });
            }
            announcedNotificationIdsRef.current.add(n.id);
          });

          nextNotifications.forEach((n) => knownNotificationIdsRef.current.add(n.id));
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    fetchNotifications();
    
    // Fetch notifications more frequently for teachers (every 10 seconds) vs students (every 15 seconds)
    const interval = setInterval(fetchNotifications, user?.role === 'teacher' || user?.role === 'admin' ? 10000 : 15000);
    
    return () => clearInterval(interval);
  }, [user, isDashboard]);

  // Show unread notification popups when student lands on or navigates inside dashboard.
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    if (!location.pathname.startsWith('/student')) return;
    // Only announce notifications relevant to the current section (papers/notes/videos)
    const pageType = (() => {
      const p = location.pathname.toLowerCase();
      if (p.includes('/papers')) return 'paper';
      if (p.includes('/notes')) return 'note';
      if (p.includes('/videos')) return 'video';
      return null;
    })();

    const unreadToAnnounce = notifications.filter(
      (n) => n.unread && !announcedNotificationIdsRef.current.has(n.id) && (pageType === null || String(n.type || '').toLowerCase() === pageType)
    );

    unreadToAnnounce.slice(0, 3).forEach((n) => {
      if (isPaymentReminderNotification(n)) {
        toast.error(n.message, {
          position: 'top-right',
          autoClose: 5000,
          closeOnClick: true,
        });
      } else {
        toast.info(n.message, {
          position: 'top-right',
          autoClose: 5000,
          closeOnClick: true,
        });
      }
      announcedNotificationIdsRef.current.add(n.id);
    });
  }, [location.pathname, notifications, user]);

  // Show unread notification popups when teacher lands on or navigates inside dashboard.
  useEffect(() => {
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) return;
    if (!location.pathname.startsWith('/teacher')) return;
    const pageType = (() => {
      const p = location.pathname.toLowerCase();
      if (p.includes('/papers')) return 'paper';
      if (p.includes('/notes')) return 'note';
      if (p.includes('/videos')) return 'video';
      return null;
    })();

    const unreadToAnnounce = notifications.filter(
      (n) => n.unread && !announcedNotificationIdsRef.current.has(n.id) && (pageType === null || String(n.type || '').toLowerCase() === pageType)
    );

    unreadToAnnounce.slice(0, 3).forEach((n) => {
      const type = String(n.type || '').toLowerCase();
      
      // Show receipt notifications prominently
      if (type === 'receipt_pending_approval') {
        toast.info(n.message, {
          position: 'top-right',
          autoClose: 6000,
          closeOnClick: true,
          className: 'bg-blue-50 border-2 border-blue-500',
        });
      } else {
        toast.info(n.message, {
          position: 'top-right',
          autoClose: 5000,
          closeOnClick: true,
        });
      }
      announcedNotificationIdsRef.current.add(n.id);
    });
  }, [location.pathname, notifications, user]);

  const handleNotificationToggle = async () => {
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);

    // When opening the panel, mark notifications as read and clear badge.
    if (nextOpen && unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

      try {
        await api.patch('/notifications/mark-read');
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    }
  };

  const [filterType, setFilterType] = useState('all');

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const isDarkHeader = !isDashboard;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features & Classes', href: '/features' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isDarkHeader
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/30'
          : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg tracking-wider">MW</span>
            </div>
            <div className="block leading-tight max-w-[170px] sm:max-w-none">
              <span className={`block font-extrabold text-[13px] sm:text-lg truncate tracking-tight transition-colors ${
                isDarkHeader ? 'text-white' : 'text-slate-900'
              }`}>
                Maleesha Wickramasinghe
              </span>
              <span className={`block text-[10px] sm:text-xs -mt-0.5 font-medium transition-colors ${
                isDarkHeader ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Tuition Classes
              </span>
            </div>
          </Link>

          {/* Navigation - Public marketing links or Dashboard portal tag */}
          {!isDashboard ? (
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? isDarkHeader
                          ? 'text-white bg-white/10 border border-white/10 shadow-sm'
                          : 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs'
                        : isDarkHeader
                          ? 'text-slate-300 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {user?.role === 'teacher' || user?.role === 'admin' ? 'Teacher Portal' : 'Student Portal'}
              </span>
              <Link
                to="/"
                className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                View Public Site →
              </Link>
            </div>
          )}

          {/* CTA Buttons / User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* User Profile */}
                <button
                  onClick={() => {
                    if (user.role === 'student') {
                      navigate('/student/dashboard');
                    } else if (user.role === 'teacher' || user.role === 'admin') {
                      navigate('/teacher/dashboard');
                    }
                  }}
                  className={`flex items-center gap-3 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isDarkHeader ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
                  }`}
                >
                  {(user.profile_picture || user.profilePicture) ? (
                    <img 
                      src={getProfileImageSrc(user.profile_picture || user.profilePicture)}
                      alt={user.name}
                      className={`w-10 h-10 rounded-full object-cover shadow-md border-2 ${
                        isDarkHeader ? 'border-slate-700' : 'border-slate-200'
                      }`}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className={`text-sm font-semibold truncate max-w-[140px] ${
                      isDarkHeader ? 'text-white' : 'text-slate-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className={`text-xs capitalize ${
                      isDarkHeader ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {user.role}
                    </p>
                  </div>
                </button>

                {/* Mobile App Download / Install Icon */}
                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-xs ${
                    isDarkHeader
                      ? 'border-blue-500/40 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                  }`}
                  title="Download / Install Mobile LMS App"
                >
                  <FiDownload className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Get Mobile App</span>
                </button>

                {/* Notifications Bell - Only on Dashboard */}
                {isDashboard && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={handleNotificationToggle}
                      className="relative p-2 rounded-lg transition-colors"
                    >
                      <FiBell className="w-6 h-6 text-gray-600" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">Notifications</h3>
                              {unreadCount > 0 && (
                                <p className="text-xs text-gray-500 mt-1">{unreadCount} unread</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setFilterType('all')}
                                className={`text-xs px-2 py-1 rounded ${filterType === 'all' ? 'bg-gray-200' : 'bg-transparent'}`}
                              >
                                All
                              </button>
                              <button
                                onClick={() => setFilterType('paper')}
                                className={`text-xs px-2 py-1 rounded ${filterType === 'paper' ? 'bg-gray-200' : 'bg-transparent'}`}
                              >
                                Papers
                              </button>
                              <button
                                onClick={() => setFilterType('note')}
                                className={`text-xs px-2 py-1 rounded ${filterType === 'note' ? 'bg-gray-200' : 'bg-transparent'}`}
                              >
                                Notes
                              </button>
                              <button
                                onClick={() => setFilterType('video')}
                                className={`text-xs px-2 py-1 rounded ${filterType === 'video' ? 'bg-gray-200' : 'bg-transparent'}`}
                              >
                                Videos
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {(() => {
                            const list = filterType === 'all' ? notifications : notifications.filter(n => String(n.type || '').toLowerCase() === filterType);
                            if (list.length > 0) {
                              return list.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                    isPaymentReminderNotification(notification)
                                      ? 'bg-red-50'
                                      : notification.unread
                                        ? 'bg-blue-50'
                                        : ''
                                  }`}
                                >
                                  <p className={`text-sm ${isPaymentReminderNotification(notification) ? 'text-red-700 font-medium' : 'text-gray-900'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {getTimeAgo(notification.created_at)}
                                  </p>
                                </div>
                              ));
                            }

                            return (
                              <div className="p-8 text-center text-gray-500">
                                <FiBell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No new notifications</p>
                              </div>
                            );
                          })()}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-200 text-center">
                            <button 
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              onClick={() => setShowNotifications(false)}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                    isDarkHeader
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/80 border-slate-700/80'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={() => setShowAppModal(true)}
              className="p-2 rounded-xl text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer"
              title="Download Mobile App"
              aria-label="Download Mobile App"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkHeader
                  ? 'text-white hover:bg-slate-800/80'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t transition-colors ${
            isDarkHeader
              ? 'border-slate-800 bg-slate-950/95 backdrop-blur-xl'
              : 'border-slate-200 bg-white/95 backdrop-blur-xl'
          }`}>
            <div className="flex flex-col gap-1 px-2">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                      isActive
                        ? isDarkHeader
                          ? 'text-white bg-white/10'
                          : 'text-blue-600 bg-blue-50'
                        : isDarkHeader
                          ? 'text-slate-300 hover:text-white hover:bg-white/5'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-2 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => {
                      if (user.role === 'student') {
                        navigate('/student/dashboard');
                      } else if (user.role === 'teacher' || user.role === 'admin') {
                        navigate('/teacher/dashboard');
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md"
                  >
                    {(user.profile_picture || user.profilePicture) ? (
                      <img 
                        src={getProfileImageSrc(user.profile_picture || user.profilePicture)}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-blue-600 text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-blue-100 capitalize">{user.role}</p>
                    </div>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLogin();
                      }}
                      className={`w-full px-6 py-3 text-center text-sm font-semibold rounded-xl border transition-colors ${
                        isDarkHeader
                          ? 'text-white border-slate-700 hover:bg-slate-800'
                          : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openRegister();
                      }}
                      className="w-full px-6 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg transition-all"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile App Download & Install Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowAppModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                  <FiSmartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">MW Tuition Mobile App</h3>
                  <p className="text-xs text-blue-100 mt-0.5">Progressive Web App (PWA) for Android & iOS</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-center">
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-2">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=http://localhost:5174/lms"
                    alt="Scan to install LMS"
                    className="w-28 h-28 object-contain"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800">Scan QR Code with your Phone Camera</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Opens the mobile LMS instantly on your phone browser</p>
              </div>

              {/* Install Instructions */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-blue-600 shrink-0">Android:</span>
                  <span>Open in Chrome ➔ Tap <strong>"Install App"</strong> or the 3 dots (⋮) ➔ <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-indigo-600 shrink-0">iPhone:</span>
                  <span>Open in Safari ➔ Tap the <strong>Share</strong> button ➔ <strong>"Add to Home Screen"</strong>.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="http://localhost:5174/lms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all text-center"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Launch Mobile Web App</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
