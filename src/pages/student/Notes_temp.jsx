import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import { FiSearch, FiDownload, FiFileText, FiFilter } from 'react-icons/fi'

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const notes = [
    { id: 1, title: "Algebra Complete Notes", subject: "Mathematics", date: "2024-01-15", size: "2.4 MB", pages: 24 },
    { id: 2, title: "Solar System Study Guide", subject: "Science", date: "2024-01-14", size: "3.8 MB", pages: 18 },
    { id: 3, title: "Python Syntax Reference", subject: "ICT", date: "2024-01-13", size: "1.2 MB", pages: 12 },
    { id: 4, title: "Fractions Practice Worksheet", subject: "Mathematics", date: "2024-01-12", size: "0.8 MB", pages: 8 },
    { id: 5, title: "Chemistry Lab Manual", subject: "Science", date: "2024-01-11", size: "5.2 MB", pages: 45 },
    { id: 6, title: "HTML & CSS Guide", subject: "ICT", date: "2024-01-10", size: "2.1 MB", pages: 20 },
    { id: 7, title: "Geometry Formulas", subject: "Mathematics", date: "2024-01-09", size: "1.5 MB", pages: 10 },
    { id: 8, title: "Biology Cell Structure", subject: "Science", date: "2024-01-08", size: "2.9 MB", pages: 15 },
  ]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === "all" || note.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Notes & PDFs</h2>
        <p className="text-gray-600 mt-1">Download all your learning materials</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="h-4 w-4 text-gray-600" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="ICT">ICT</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-blue-600">
                <FiFileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <Badge variant="secondary">{note.subject}</Badge>
                  <span>{note.size}</span>
                  <span>{note.pages} pages</span>
                  <span className="hidden md:inline">{new Date(note.date).toLocaleDateString()}</span>
                </div>
              </div>
              <Button>
                <FiDownload className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
