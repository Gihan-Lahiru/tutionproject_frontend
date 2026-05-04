import { useState } from "react";
import { Search, Plus, Users, BookOpen, Edit, Trash2 } from "lucide-react";

const classesData = {
  "Institute A": {
    "Grade 6-9": [
      { id: 1, title: "Grade 6 Science", students: 24, schedule: "Mon, Wed 4:00 PM", institute: "Institute A" },
      { id: 2, title: "Grade 7 Science", students: 28, schedule: "Tue, Thu 5:00 PM", institute: "Institute A" },
      { id: 3, title: "Grade 8 Science", students: 26, schedule: "Wed, Fri 4:30 PM", institute: "Institute A" },
      { id: 4, title: "Grade 9 Science", students: 30, schedule: "Mon, Thu 5:30 PM", institute: "Institute A" },
    ],
    "Grade 10-11": [
      { id: 5, title: "Grade 10 Science", students: 32, schedule: "Mon, Wed, Fri 4:00 PM", institute: "Institute A" },
      { id: 6, title: "Grade 11 Science", students: 28, schedule: "Tue, Thu, Sat 5:00 PM", institute: "Institute A" },
    ],
    "A/L Classes": [
      { id: 7, title: "Grade 12 Chemistry", students: 23, schedule: "Mon, Wed 6:00 PM", institute: "Institute A" },
      { id: 8, title: "Grade 13 Chemistry", students: 20, schedule: "Tue, Thu 7:00 PM", institute: "Institute A" },
    ],
  },
  "Institute B": {
    "Grade 6-9": [
      { id: 9, title: "Grade 6 Science", students: 22, schedule: "Tue, Thu 4:00 PM", institute: "Institute B" },
      { id: 10, title: "Grade 7 Science", students: 25, schedule: "Mon, Wed 5:00 PM", institute: "Institute B" },
      { id: 11, title: "Grade 8 Science", students: 27, schedule: "Wed, Fri 5:00 PM", institute: "Institute B" },
      { id: 12, title: "Grade 9 Science", students: 29, schedule: "Thu, Sat 6:00 PM", institute: "Institute B" },
    ],
    "Grade 10-11": [
      { id: 13, title: "Grade 10 Science", students: 31, schedule: "Mon, Wed, Fri 5:00 PM", institute: "Institute B" },
      { id: 14, title: "Grade 11 Science", students: 26, schedule: "Tue, Thu, Sat 6:00 PM", institute: "Institute B" },
    ],
    "A/L Classes": [
      { id: 15, title: "Grade 12 Chemistry", students: 24, schedule: "Mon, Wed 7:00 PM", institute: "Institute B" },
      { id: 16, title: "Grade 13 Chemistry", students: 21, schedule: "Tue, Thu 8:00 PM", institute: "Institute B" },
    ],
  },
};

export default function Classes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const institutes = Object.keys(classesData);

  const filteredClasses = () => {
    if (selectedInstitute === "all") {
      return classesData;
    }
    return { [selectedInstitute]: classesData[selectedInstitute] };
  };

  const getTotalClasses = () => {
    let total = 0;
    Object.values(classesData).forEach(institute => {
      Object.values(institute).forEach(gradeClasses => {
        total += gradeClasses.length;
      });
    });
    return total;
  };

  const getTotalStudents = () => {
    let total = 0;
    Object.values(classesData).forEach(institute => {
      Object.values(institute).forEach(gradeClasses => {
        gradeClasses.forEach(cls => {
          total += cls.students;
        });
      });
    });
    return total;
  };

  const getInstituteStats = (instituteName) => {
    let totalClasses = 0;
    let totalStudents = 0;
    const instituteData = classesData[instituteName];
    
    if (instituteData) {
      Object.values(instituteData).forEach(gradeClasses => {
        totalClasses += gradeClasses.length;
        gradeClasses.forEach(cls => {
          totalStudents += cls.students;
        });
      });
    }
    
    return {
      classes: totalClasses,
      students: totalStudents,
      average: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0
    };
  };

  const getActiveClassesToday = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    
    let count = 0;
    Object.values(classesData).forEach(institute => {
      Object.values(institute).forEach(gradeClasses => {
        gradeClasses.forEach(cls => {
          if (cls.schedule.includes(today)) {
            count++;
          }
        });
      });
    });
    return count;
  };

  const getInstituteActiveClassesToday = (instituteName) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    const instituteData = classesData[instituteName];
    
    let count = 0;
    if (instituteData) {
      Object.values(instituteData).forEach(gradeClasses => {
        gradeClasses.forEach(cls => {
          if (cls.schedule.includes(today)) {
            count++;
          }
        });
      });
    }
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Manage your classes for grades 6-11 and A/L students</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add New Class
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Institutes</option>
            {institutes.map((institute) => (
              <option key={institute} value={institute}>
                {institute}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{getTotalClasses()}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{getTotalStudents()}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Classes Today</p>
              <p className="text-3xl font-bold text-gray-900">{getActiveClassesToday()}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Institute-wise Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institute A Stats */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Institute A</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Classes</span>
              <span className="text-2xl font-bold text-primary">{getInstituteStats("Institute A").classes}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Students</span>
              <span className="text-2xl font-bold text-primary">{getInstituteStats("Institute A").students}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Active Classes Today</span>
              <span className="text-2xl font-bold text-primary">{getInstituteActiveClassesToday("Institute A")}</span>
            </div>
          </div>
        </div>

        {/* Institute B Stats */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Institute B</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Classes</span>
              <span className="text-2xl font-bold text-primary">{getInstituteStats("Institute B").classes}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Students</span>
              <span className="text-2xl font-bold text-primary">{getInstituteStats("Institute B").students}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="text-sm text-gray-600">Active Classes Today</span>
              <span className="text-2xl font-bold text-primary">{getInstituteActiveClassesToday("Institute B")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Classes by Institute and Grade */}
      {Object.entries(filteredClasses()).map(([institute, gradeData]) => (
        <div key={institute} className="space-y-6">
          <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold">{institute}</h2>
            <p className="text-white/80 mt-1">
              {Object.values(gradeData).reduce((total, classes) => total + classes.length, 0)} classes total
            </p>
          </div>

          {Object.entries(gradeData).map(([category, classes]) => (
            <div key={category} className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                <p className="text-sm text-gray-600 mt-1">{classes.length} classes</p>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {classes
                    .filter((cls) =>
                      cls.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            {cls.students}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{cls.title}</h4>
                            <p className="text-sm text-gray-600">{cls.schedule}</p>
                            <p className="text-xs text-primary mt-1">{cls.institute}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {cls.students} students
                            </p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-primary" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
