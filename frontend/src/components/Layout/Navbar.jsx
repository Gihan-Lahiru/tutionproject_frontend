import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const knownNotificationIdsRef = useRef(new Set());
  const notificationsInitializedRef = useRef(false);
  const announcedNotificationIdsRef = useRef(new Set());
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isPaymentReminderNotification = (notification) => {
    const type = String(notification?.type || '').toLowerCase();
    const msg = String(notification?.message || '').toLowerCase();
    return type === 'payment' && msg.includes('payment reminder');
  };

  // Check if we're on a dashboard page
  const isDashboard = location.pathname.includes('/student/') || location.pathname.includes('/teacher/');

  // Fetch real notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && isDashboard) {
        try {
          const response = await api.get('/notifications/my-notifications');
          const nextNotifications = response.data.notifications || [];
          setNotifications(nextNotifications);
          setUnreadCount(response.data.unreadCount || 0);

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

          nextNotifications.forEach((n) => knownNotificationIdsRef.current.add(n.id));
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    fetchNotifications();
    
    // Refresh notifications frequently so new reminders appear quickly.
    const interval = setInterval(fetchNotifications, 15000);
    
    return () => clearInterval(interval);
  }, [user, isDashboard]);

  // Show unread notification popups when student lands on or navigates inside dashboard.
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    if (!location.pathname.startsWith('/student')) return;

    const unreadToAnnounce = notifications.filter(
      (n) => n.unread && !announcedNotificationIdsRef.current.has(n.id)
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

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features & Classes', href: '/features' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">MW</span>
            </div>
            <div className="block leading-tight max-w-[150px] sm:max-w-none">
              <span className="block font-bold text-[13px] sm:text-lg text-gray-900 truncate">Maleesha Wickramasinghe</span>
              <span className="block text-[10px] sm:text-xs text-gray-600 -mt-0.5">Tuition Classes</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

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
                  className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all"
                >
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-base font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                  </div>
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
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{unreadCount} unread</p>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
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
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-500">
                              <FiBell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No new notifications</p>
                            </div>
                          )}
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
                <Link
                  to="/login"
                  className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 px-4 flex flex-col gap-2">
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
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg"
                  >
                    {user.profile_picture ? (
                      <img 
                        src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
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
                    <Link
                      to="/login"
                      className="w-full px-6 py-3 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full px-6 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:shadow-lg transition-all"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
