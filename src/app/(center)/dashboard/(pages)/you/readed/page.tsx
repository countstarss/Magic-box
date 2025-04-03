"use client";

import { useState, useEffect } from "react";

type ReadingMaterial = {
  id: number;
  title: string;
  progress: number; // percentage of completion
  lastAccessed: string; // timestamp
};

export default function Readed() {
  const [readedMaterials, setReadedMaterials] = useState<ReadingMaterial[]>([]);

  // Simulate fetching data from API
  useEffect(() => {
    const fetchReadedMaterials = async () => {
      const mockData: ReadingMaterial[] = [
        {
          id: 1,
          title: "HSK 1.0 Vocabulary Guide",
          progress: 100,
          lastAccessed: "2024-12-10T10:00:00Z",
        },
        {
          id: 2,
          title: "Intermediate Grammar Notes",
          progress: 65,
          lastAccessed: "2024-12-14T12:30:00Z",
        },
      ];
      setReadedMaterials(mockData);
    };

    fetchReadedMaterials();
  }, []);

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        My Reading Progress
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Manage and view your reading progress.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readedMaterials.length > 0 ? (
          readedMaterials.map((material) => (
            <div
              key={material.id}
              className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {material.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Progress: {material.progress}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Accessed:{" "}
                {new Date(material.lastAccessed).toLocaleDateString("en-US")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No reading materials found.
          </p>
        )}
      </div>
    </div>
  );
}
