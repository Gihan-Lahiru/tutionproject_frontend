import { useState, useEffect, useRef } from 'react';
import { FiBookOpen, FiX, FiCalendar, FiBook, FiUsers, FiClock, FiMapPin } from 'react-icons/fi';

const gradesData = [
  {
    grade: 'Grade 6 Science',
    description: 'දේශීය විභාග සම්පුර්ණ syllabus එක ආවරණය කරන විද්‍යාව',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ජීවී හා අජීවී දෑ' },
      { id: 2, name: 'ශාක කොටස් සහ ඒවායේ කාර්යයන්' },
      { id: 3, name: 'ශාක වර්ග හා ශාක වැදගත්කම' },
      { id: 4, name: 'සත්ත්ව වර්ගීකරණය' },
      { id: 5, name: 'සත්ත්ව වාසස්ථාන' },
      { id: 6, name: 'මනුෂ්‍ය ශරීර කොටස්' },
      { id: 7, name: 'සෞඛ්‍ය සම්පන්න ජීවන රටාව' },
      { id: 8, name: 'ද්‍රව්‍ය වර්ග (ඝන, ද්‍රව, වායු)' },
      { id: 9, name: 'ද්‍රව්‍ය වල ගුණ' },
      { id: 10, name: 'ශක්ති ආකාර' },
      { id: 11, name: 'ශක්ති මූලාශ්‍ර සහ භාවිත' },
      { id: 12, name: 'බලය (තල්ලු කිරීම හා ඇදීම)' },
      { id: 13, name: 'චලනය සහ එහි බලපෑම්' },
      { id: 14, name: 'ආලෝකය සහ සෙවනැලි' },
      { id: 15, name: 'ශබ්දය' },
      { id: 16, name: 'පෘථිවිය, සූර්යයා හා චන්ද්‍රයා' },
      { id: 17, name: 'දිනය හා රාත්‍රිය' },
      { id: 18, name: 'කාලගුණය' },
      { id: 19, name: 'පරිසරය සහ පරිසර ආරක්ෂාව' }
    ]
  },
  {
    grade: 'Grade 7 Science',
    description: 'දේශීය විභාග සම්පුර්ණ syllabus එක ආවරණය කරන විද්‍යාව',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ශාක විවිධත්වය' },
      { id: 2, name: 'ස්ථිති විද්‍යුතය' },
      { id: 3, name: 'විදුලි ජනනය' },
      { id: 4, name: 'ජලයේ කාර්ය' },
      { id: 5, name: 'අම්ල හා භස්ම' },
      { id: 6, name: 'සත්ත්ව විවිධත්වය' },
      { id: 7, name: 'ශක්ති ආකාර හා භාවිත' },
      { id: 8, name: 'පෘථිවියේ ස්වභාවය' },
      { id: 9, name: 'ආලෝකය' },
      { id: 10, name: 'අන්වීක්ෂයේ නිවැරදි භාවිතය' },
      { id: 11, name: 'ධ්වනිය' },
      { id: 12, name: 'ජෛව ක්‍රියාවලි' },
      { id: 13, name: 'වායුගෝලය' },
      { id: 14, name: 'තාපය හා උෂ්ණත්වය' },
      { id: 15, name: 'පස' },
      { id: 16, name: 'බලය හා චලිතය' },
      { id: 17, name: 'ආහාරවල ඇති පෝෂක' },
      { id: 18, name: 'ඛනිජ හා පාෂාණ' },
      { id: 19, name: 'ශක්ති ප්‍රභව' }
    ]
  },
  {
    grade: 'Grade 8 Science',
    description: 'මධ්‍යම පන්තියට ගැලපෙන සවිස්තරාත්මක විද්‍යා පාඩම්',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ක්ෂුද්‍ර ජීවීන්ගේ වැදගත්කම' },
      { id: 2, name: 'සත්ත්ව වර්ගීකරණය' },
      { id: 3, name: 'ශාක කොටස් වල විවිධත්වය හා කෘත්‍ය' },
      { id: 4, name: 'පදාර්ථයේ ගුණ' },
      { id: 5, name: 'ධ්වනිය' },
      { id: 6, name: 'චුම්බක' },
      { id: 7, name: 'ධාරා විද්‍යුතය පිළිබඳ මිනුම්' },
      { id: 8, name: 'පදාර්ථයේ විපර්යාස' },
      { id: 9, name: 'මානව ඉන්ද්‍රිය පද්ධති' },
      { id: 10, name: 'විද්‍යුතය' },
      { id: 11, name: 'ශාකවල ප්‍රධාන ජෛව ක්‍රියාවලි' },
      { id: 12, name: 'ජීවීන්ගේ ජීවන චක්‍ර' },
      { id: 13, name: 'ආහාර පරිරක්ෂණය' },
      { id: 14, name: 'සෞරග්‍රහ මණ්ඩලය ආශ්‍රිත සංසිද්ධි හා ගවේෂණ' },
      { id: 15, name: 'ස්වාභාවික ආපදා' }
    ]
  },
  {
    grade: 'Grade 9 Science',
    description: 'සද්ධන විභාගයට සූදානම් වන සිසුන් සඳහා',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ක්ෂුද්‍ර ජීවීන්ගේ භාවිතය' },
      { id: 2, name: 'ඇස හා කන' },
      { id: 3, name: 'පදාර්ථයේ ස්වභාවය හා ගුණ' },
      { id: 4, name: 'බලය හා සම්බන්ධ මූලික සංකල්ප' },
      { id: 5, name: 'ඝන ද්‍රව්‍ය මගින් ඇතිකරන පීඩන' },
      { id: 6, name: 'මානව රුදිර සන්සරන පද්ධතිය' },
      { id: 7, name: 'ශාක වර්ධක ද්‍රව්‍ය' },
      { id: 8, name: 'ජීවින්ගේ සන්ධාරණය හා චලනය' },
      { id: 9, name: 'පරිණාමික ක්‍රියාවලිය' },
      { id: 10, name: 'විද්‍යුත් විච්ඡේදනය' },
      { id: 11, name: 'ඝනත්වය' },
      { id: 12, name: 'ජෛව විවිධත්වය' },
      { id: 13, name: 'කෘත්‍රීම පරිසරය හා හරිත සංකල්ප' },
      { id: 14, name: 'තරංග පරාවර්තනය හා වර්තනය' },
      { id: 15, name: 'සරල යන්ත්‍ර' },
      { id: 16, name: 'නැනෝ තාක්ෂණය හා එහි භාවිත' },
      { id: 17, name: 'අකුනු අනතුරු' },
      { id: 18, name: 'ස්වාභාවික ආපදා' },
      { id: 19, name: 'ස්වාභාවික සම්පත් තිරසාරව භාවිතය' }
    ]
  },
  {
    grade: 'Grade 10 Science',
    description: 'O/L විද්‍යා පද්ධතිය සඳහා ශක්තිමත් පාදයක්',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ජීවයේ රසායනික පදනම' },
      { id: 2, name: 'සරල රේඛීය චලිතය' },
      { id: 3, name: 'පදාර්ථයේ ව්‍යුහය' },
      { id: 4, name: 'චලිතය පිළිබඳ නිව්ටන් නියම' },
      { id: 5, name: 'ඝර්ෂණය' },
      { id: 6, name: 'ශාක හා සත්ව සෛල ව්‍යුහය හා කෘත්‍ය' },
      { id: 7, name: 'මූලද්‍රව්‍ය හා සංයෝග ප්‍රමාණනය' },
      { id: 8, name: 'ජීවීන්ගේ ලාක්ෂණික ගුණ' },
      { id: 9, name: 'සම්ප්‍රයුක්ත බලය' },
      { id: 10, name: 'රසායනික බන්ධන' },
      { id: 11, name: 'බලයක භ්‍රමණ ආචරණ' },
      { id: 12, name: 'බල සමතුලිතතාව' },
      { id: 13, name: 'ජෛව ලෝකය' },
      { id: 14, name: 'ජීවයේ අඛණ්ඩතාව' },
      { id: 15, name: 'ද්‍රවස්ථිති පීඩනය හා එහි යෙදීම්' },
      { id: 16, name: 'පදාර්ථයේ වෙනස් වීම්' },
      { id: 17, name: 'ප්‍රතික්‍රියා ශීඝ්‍රතාවය' },
      { id: 18, name: 'කාර්යය, ශක්තිය හා ජවය' },
      { id: 19, name: 'ධාරා විද්‍යුතය' },
      { id: 20, name: 'ප්‍රවේණිය' }
    ]
  },
  {
    grade: 'Grade 11 Science',
    description: 'O/L විද්‍යාව සම්පුර්ණයෙන් ආවරණය කරන ඉහළම මට්ටමේ පාඩම්',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'ජීවී පටක' },
      { id: 2, name: 'ප්‍රභාසංශ්ලේෂණ' },
      { id: 3, name: 'මිශ්‍රණ' },
      { id: 4, name: 'තරංග සහ ඒවායේ යෙදීම්' },
      { id: 5, name: 'ප්‍රකාශ විද්‍යාව' },
      { id: 6, name: 'මානව දේහ ක්‍රියාවලි' },
      { id: 7, name: 'අම්ල, භස්ම හා ලවණ' },
      { id: 8, name: 'රසායනික ප්‍රතික්‍රියා ආශ්‍රිත තාප විපර්යාස' },
      { id: 9, name: 'තාපය' },
      { id: 10, name: 'විද්‍යුත් උපකරණවල ජවය හා ශක්තිය' },
      { id: 11, name: 'ඉලෙක්ට්‍රොනික විද්‍යාව' },
      { id: 12, name: 'විද්‍යුත් රසායනය' },
      { id: 13, name: 'විද්‍යුත් චුම්බකත්වය සහ විද්‍යුත් චුම්බක ප්‍රේරණය' },
      { id: 14, name: 'හයිඩ්රොකාබන හා ඒවායේ ව්‍යුත්පන්න' },
      { id: 15, name: 'ජෛව ගෝලය' }
    ]
  },
  {
    grade: 'A/L Chemistry',
    description: 'Advanced Level Chemistry - Comprehensive coverage of A/L syllabus',
    gradient: 'from-blue-600 to-cyan-500',
    topics: [
      { id: 1, name: 'පරමාණුක ව්‍යුහය' },
      { id: 2, name: 'ව්‍යුහය හා බන්ධන' },
      { id: 3, name: 'රසායනික ගණනය කිරීම්' },
      { id: 4, name: 'පදාර්ථයේ වායු අවස්ථාව' },
      { id: 5, name: 'ශක්ති විද්‍යාව' },
      { id: 6, name: 'අකාබනික රසායනය' },
      { id: 7, name: 'චාලක රසායනය' },
      { id: 8, name: 'කාබනික රසායනය' },
      { id: 9, name: 'රසායනික සමතුලිතතාවය' },
      { id: 10, name: 'අයනික සමතුලිතතාවය' },
      { id: 11, name: 'කලාප රසායනය' },
      { id: 12, name: 'විද්‍යුත් රසායනය' },
      { id: 13, name: 'කර්මාන්ත රසායනය' }
    ],
    isHighlighted: true
  }
];

const GradesSection = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const parallaxRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      if (!parallaxRef.current || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Skip costly updates when section is fully out of view.
      if (rect.bottom < 0 || rect.top > viewportH) return;

      const isMobile = window.innerWidth < 768;
      const speed = isMobile ? 0.3 : 0.5;
      
      // Calculate offset based on how much of the section is visible
      // When section enters viewport (rect.top = viewportH), start parallax
      // As we scroll down, rect.top decreases, creating the parallax effect
      const progress = (viewportH - rect.top) / (viewportH + rect.height);
      const offset = (progress - 0.5) * 100 * speed;

      parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const requestTick = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateParallax);
    };

    // Initial call
    updateParallax();
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
    };
  }, []);

  const handleCardClick = (grade) => {
    setSelectedGrade(grade);
  };

  const closeModal = () => {
    setSelectedGrade(null);
  };

  return (
    <section ref={sectionRef} className="py-0 relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/graduation-cap-earth-globe.jpg)',
          willChange: 'transform'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Classes &amp; Topics Covered
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto text-lg drop-shadow-md">
              Grade 6 සිට 11 දක්වා විද්‍යාව සහ A/L Chemistry සම්පුර්ණ syllabus එක systematicalව covering කරන පාඩම්.
              ඔබේ පන්තිය තෝරාගෙන ඉගෙනගන්නා විෂය කොටස් පහසුවෙන් බලන්න.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradesData.map((grade, index) => {
              const isHighlighted = grade.isHighlighted || false;
              const isLastCard = index === gradesData.length - 1;
              
              return (
                <div
                  key={grade.grade}
                  onClick={() => handleCardClick(grade)}
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer h-[200px] flex flex-col bg-gradient-to-br ${grade.gradient || 'from-purple-600 to-pink-500'} shadow-lg hover:shadow-2xl border border-white/20 hover:scale-105 ${
                    isLastCard ? 'lg:col-start-2 md:col-start-1' : ''
                  }`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {grade.grade}
                      </h3>
                    </div>
                    <p className="text-sm mb-3 text-white/95 drop-shadow-md">
                      {grade.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/30 text-white backdrop-blur-sm drop-shadow-md">
                      <FiBookOpen className="w-3 h-3" />
                      {grade.topics.length > 0 ? `${grade.topics.length} Topics` : 'Coming Soon'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedGrade && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedGrade.grade}</h2>
                  <p className="text-white/90 text-sm">{selectedGrade.description}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <FiX className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {selectedGrade.topics.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedGrade.topics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-white font-bold text-sm">
                            {topic.id.toString().padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-gray-800 font-medium group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'UN-Gurulugomi', sans-serif" }}>
                            {topic.name}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg font-medium mb-2">Content Coming Soon</p>
                  <p className="text-gray-400 text-sm">Topics will be added shortly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GradesSection;


