"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "../_components/PublicCourseCard";
import { courseCategories } from "@/lib/zodSchemas"; 
import { IconChevronDown } from "@tabler/icons-react";

interface CoursesListProps {
  initialCourses: PublicCourseType[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fuse = useMemo(
    () => new Fuse(initialCourses, {
      keys: ["title", "smallDescription", "category"],
      threshold: 0.3,
    }),
    [initialCourses]
  );

  const filteredCourses = useMemo(() => {
    let results = initialCourses;

    if (searchTerm) {
      results = fuse.search(searchTerm).map(r => r.item);
    }

    if (selectedCategory && selectedCategory !== "All") {
      results = results.filter(c => c.category === selectedCategory);
    }

    return results;
  }, [searchTerm, selectedCategory, fuse, initialCourses]);

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search courses"
        className="px-4 py-2 border rounded-lg w-full md:w-1/2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ color: "var(--foreground)", backgroundColor: "var(--background)" }}
      />

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 relative">
        {/* All Button */}
        <button
          className={`px-3 py-1 rounded-lg border transition-colors ${
            selectedCategory === null
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            className={`flex items-center justify-between px-3 py-1 rounded-lg border transition-colors ${
              selectedCategory && selectedCategory !== "All"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
           <span> {selectedCategory || "Select Category"}</span>
            <IconChevronDown className="ml-2 size-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-1 z-50 border rounded shadow-lg w-48 bg-[var(--background)]">
              {courseCategories.map((cat) => (
                <div
                  key={cat}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No courses found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <PublicCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </div>
  );
}
