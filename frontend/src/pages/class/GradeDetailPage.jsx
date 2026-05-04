import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../../components/Layout/Navbar';

const gradeData = {
  'grade-6': {
    title: 'Grade 6 Science',
    description: 'දේශීය විභාග සඳහා පදනම සකස් කරන විද්‍යාව',
    level: 'Junior Secondary',
    topics: [
      'ශාක විවිධත්වය',
      'සත්ත්ව විවිධත්වය',
      'ජෛව ක්‍රියාවලි',
      'ආලෝකය',
      'ධ්වනිය',
      'තාපය හා උෂ්ණත්වය',
      'බලය හා චලිතය',
      'ආහාරවල ඇති පෝෂක',
      'ශක්ති ප්‍රභව',
      'පරිසර අධ්‍යයනය'
    ],
    duration: '2 hours per week',
    students: '15-20 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'grade-7': {
    title: 'Grade 7 Science',
    description: 'දේශීය විභාග සම්පුර්ණ syllabus එක ආවරණය කරන විද්‍යාව',
    level: 'Junior Secondary',
    topics: [
      'ශාක විවිධත්වය',
      'ස්ථිති විද්‍යුතය',
      'විදුලි ජනනය',
      'ජලයේ කාර්ය',
      'අම්ල හා භස්ම',
      'සත්ත්ව විවිධත්වය',
      'ශක්ති ආකාර හා භාවිත',
      'පෘථිවියේ ස්වභාවය',
      'ආලෝකය',
      'අන්වීක්ෂයේ නිවැරදි භාවිතය',
      'ධ්වනිය',
      'ජෛව ක්‍රියාවලි',
      'වායුගෝලය',
      'තාපය හා උෂ්ණත්වය',
      'පස',
      'බලය හා චලිතය',
      'ආහාරවල ඇති පෝෂක',
      'ඛනිජ හා පාෂාණ',
      'ශක්ති ප්‍රභව'
    ],
    duration: '2 hours per week',
    students: '15-20 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'grade-8': {
    title: 'Grade 8 Science',
    description: 'මධ්‍යම පන්තියට ගැලපෙන සවිස්තරාත්මක විද්‍යා පාඩම්',
    level: 'Junior Secondary',
    topics: [
      'ක්ෂුද්‍ර ජීවීන්ගේ වැදගත්කම',
      'සත්ත්ව වර්ගීකරණය',
      'ශාක කොටස් වල විවිධත්වය හා කෘත්‍ය',
      'පදාර්ථයේ ගුණ',
      'ධ්වනිය',
      'චුම්බක',
      'ධාරා විද්‍යුතය පිළිබඳ මිනුම්',
      'පදාර්ථයේ විපර්යාස',
      'මානව ඉන්ද්‍රිය පද්ධති',
      'විද්‍යුතය',
      'ශාකවල ප්‍රධාන ජෛව ක්‍රියාවලි',
      'ජීවීන්ගේ ජීවන චක්‍ර',
      'ආහාර පරිරක්ෂණය',
      'සෞරග්‍රහ මණ්ඩලය',
      'ස්වාභාවික ආපදා'
    ],
    duration: '2 hours per week',
    students: '15-20 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'grade-9': {
    title: 'Grade 9 Science',
    description: 'සද්ධන විභාගයට සූදානම් වන සිසුන් සඳහා',
    level: 'Junior Secondary',
    topics: [
      'ක්ෂුද්‍ර ජීවීන්ගේ භාවිතය',
      'ඇස හා කන',
      'පදාර්ථයේ ස්වභාවය හා ගුණ',
      'බලය හා සම්බන්ධ මූලික සංකල්ප',
      'ඝන ද්‍රව්‍ය මගින් ඇතිකරන පීඩන',
      'මානව රුදිර සන්සරන පද්ධතිය',
      'ශාක වර්ධක ද්‍රව්‍ය',
      'ජීවින්ගේ සන්ධාරණය හා චලනය',
      'පරිණාමික ක්‍රියාවලිය',
      'විද්‍යුත් විච්ඡේදනය',
      'ඝනත්වය',
      'ජෛව විවිධත්වය',
      'කෘත්‍රීම පරිසරය හා හරිත සංකල්ප',
      'තරංග පරාවර්තනය හා වර්තනය',
      'සරල යන්ත්‍ර',
      'නැනෝ තාක්ෂණය',
      'අකුනු අනතුරු',
      'ස්වාභාවික ආපදා',
      'ස්වාභාවික සම්පත් තිරසාරව භාවිතය'
    ],
    duration: '2.5 hours per week',
    students: '15-20 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'grade-10': {
    title: 'Grade 10 Science',
    description: 'O/L විද්‍යා පද්ධතිය සඳහා ශක්තිමත් පාදයක්',
    level: 'O/L',
    topics: [
      'ජීවයේ රසායනික පදනම',
      'සරල රේඛීය චලිතය',
      'පදාර්ථයේ ව්‍යුහය',
      'චලිතය පිළිබඳ නිව්ටන් නියම',
      'ඝර්ෂණය',
      'ශාක හා සත්ව සෛල ව්‍යුහය හා කෘත්‍ය',
      'මූලද්‍රව්‍ය හා සංයෝග ප්‍රමාණනය',
      'ජීවීන්ගේ ලාක්ෂණික ගුණ',
      'සම්ප්‍රයුක්ත බලය',
      'රසායනික බන්ධන',
      'බලයක භ්‍රමණ ආචරණ',
      'බල සමතුලිතතාව',
      'ජෛව ලෝකය',
      'ජීවයේ අඛණ්ඩතාව',
      'ද්‍රවස්ථිති පීඩනය හා එහි යෙදීම්',
      'පදාර්ථයේ වෙනස් වීම්',
      'ප්‍රතික්‍රියා ශීඝ්‍රතාවය',
      'කාර්යය, ශක්තිය හා ජවය',
      'ධාරා විද්‍යුතය'
    ],
    duration: '3 hours per week',
    students: '15-25 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'grade-11': {
    title: 'Grade 11 Science',
    description: 'O/L විභාග සූදානම සඳහා සම්පුර්ණ විද්‍යා පාඩම්',
    level: 'O/L',
    topics: [
      'ජීවයේ රසායනික පදනම',
      'සරල රේඛීය චලිතය',
      'පදාර්ථයේ ව්‍යුහය',
      'චලිතය පිළිබඳ නිව්ටන් නියම',
      'ඝර්ෂණය',
      'ශාක හා සත්ව සෛල ව්‍යුහය',
      'මූලද්‍රව්‍ය හා සංයෝග',
      'ජීවීන්ගේ ලාක්ෂණික ගුණ',
      'රසායනික බන්ධන',
      'බලයක භ්‍රමණ ආචරණ',
      'ජෛව ලෝකය',
      'ජීවයේ අඛණ්ඩතාව',
      'පදාර්ථයේ වෙනස් වීම්',
      'ප්‍රතික්‍රියා ශීඝ්‍රතාවය',
      'විද්‍යුත් චුම්භක ප්‍රේරණය',
      'පරිසරය සහ මිනිසා',
      'Past Paper Practice',
      'Revision Sessions'
    ],
    duration: '3 hours per week',
    students: '15-25 students per batch',
    gradient: 'from-blue-600 to-cyan-500'
  },
  'al-chemistry': {
    title: 'A/L Chemistry',
    description: 'උසස් පෙළ රසායන විද්‍යාව සඳහා සම්පූර්ණ සහාය',
    level: 'A/L',
    topics: [
      'Physical Chemistry - Atomic Structure',
      'Chemical Bonding',
      'States of Matter',
      'Chemical Kinetics',
      'Chemical Equilibrium',
      'Thermochemistry',
      'Electrochemistry',
      'Inorganic Chemistry - s-Block',
      'p-Block Elements',
      'd-Block Elements',
      'Coordination Chemistry',
      'Organic Chemistry - Hydrocarbons',
      'Alcohols and Phenols',
      'Aldehydes and Ketones',
      'Carboxylic Acids',
      'Amines',
      'Polymers',
      'Past Paper Analysis',
      'Practical Sessions'
    ],
    duration: '4 hours per week',
    students: '10-15 students per batch',
    gradient: 'from-purple-600 to-pink-500'
  },
  'al-biology': {
    title: 'A/L Biology',
    description: 'උසස් පෙළ ජීව විද්‍යාව සඳහා සම්පූර්ණ සහාය',
    level: 'A/L',
    topics: [
      'Cell Biology',
      'Biochemistry',
      'Molecular Biology',
      'Genetics',
      'Evolution',
      'Plant Structure and Function',
      'Animal Structure and Function',
      'Human Physiology',
      'Ecology',
      'Environmental Biology',
      'Biodiversity',
      'Biotechnology',
      'Microbiology',
      'Immunology',
      'Plant Physiology',
      'Animal Behavior',
      'Past Paper Analysis',
      'Practical Sessions'
    ],
    duration: '4 hours per week',
    students: '10-15 students per batch',
    gradient: 'from-purple-600 to-pink-500'
  }
};

const GradeDetailPage = () => {
  const { grade } = useParams();
  const data = gradeData[grade];

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Grade Not Found</h1>
            <Link to="/classes" className="text-blue-600 hover:underline">
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/classes"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Classes</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <span className="text-sm font-medium text-blue-600">{data.level}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {data.title}
              </h1>
              
              <p className="text-xl text-gray-700 mb-8">{data.description}</p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${data.gradient} flex items-center justify-center shrink-0`}>
                    <FiClock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{data.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${data.gradient} flex items-center justify-center shrink-0`}>
                    <FiUsers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class Size</p>
                    <p className="font-semibold text-gray-900">{data.students}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className={`px-8 py-4 bg-gradient-to-r ${data.gradient} text-white font-medium rounded-xl hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  Enroll Now
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-gray-900 font-medium rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div className="relative">
              <div className={`aspect-square rounded-3xl bg-gradient-to-br ${data.gradient} p-1 shadow-2xl`}>
                <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className={`w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${data.gradient} flex items-center justify-center`}>
                      <FiBookOpen className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h3>
                    <p className="text-gray-600">Interactive Learning Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className={`bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
                Topics Covered
              </span>
            </h2>
            <p className="text-lg text-gray-600">Comprehensive syllabus coverage for excellent results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <FiCheckCircle className={`w-6 h-6 shrink-0 mt-0.5 bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                <span className="text-gray-700 font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Classes?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center`}>
                <FiBookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Notes</h3>
              <p className="text-gray-600">Well-organized study materials and notes for all topics</p>
            </div>

            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center`}>
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Small Batches</h3>
              <p className="text-gray-600">Individual attention in small, focused class groups</p>
            </div>

            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center`}>
                <FiClock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Timing</h3>
              <p className="text-gray-600">Both physical and online classes available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-br ${data.gradient}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Excel in {data.title}?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our classes and experience quality education with proven results
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-medium rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GradeDetailPage;
