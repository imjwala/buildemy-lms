"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "../_components/PublicCourseCard";

interface CoursesListProps {
  initialCourses: PublicCourseType[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<PublicCourseType[]>(initialCourses);

  // Fuse.js options
  const fuse = new Fuse(initialCourses, {
    keys: ["title", "smallDescription", "category"],
    threshold: 0.3, // controls fuzziness
  });

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses(initialCourses);
    } else {
      // Perform fuzzy search
      const results = fuse.search(searchTerm).map(r => r.item);

      // Filter to only include items where any field starts with the search term
      const startsWithResults = results.filter(course =>
        course.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        course.smallDescription.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      setFilteredCourses(startsWithResults);
    }
  }, [searchTerm, initialCourses]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search courses"
        className="px-4 py-2 border rounded-lg w-full md:w-1/2 mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {filteredCourses.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No courses found.</p>
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
