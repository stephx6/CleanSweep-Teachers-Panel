import DefaultLayout from "../layout/DefaultLayout";
import { getAllClassrooms } from "../api/classroomApi";
import ClassCard from "../components/classroom/ClassCard";
import { useEffect, useState } from "react";
import CreateClassModal from "../components/classroom/CreateClassModal";
import { getAuth } from "firebase/auth";
import { createClassroomCode } from "../api/adminApi";
export default function Classrooms() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const refreshClassrooms = async () => {
    try {
      const data = await getAllClassrooms();
      setClassrooms(data);
    } catch (error) {
      console.error("Failed to get classrooms:", error);
    }
  };

  useEffect(() => {
    refreshClassrooms();
  }, []);
  const handleCreateClassroom = async (classroomName: string) => {
    setIsSubmitting(true);
    try {
      if (!uid) return;

      await createClassroomCode(uid, classroomName);
      await refreshClassrooms();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create classroom:", error);
      // consider surfacing this to the user, e.g. a toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (


      <DefaultLayout>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏫</span>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Classrooms</h2>
                <p className="text-xs text-[#64748B]">
                  {classrooms.length} active classes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-all"
            >
              + Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <ClassCard
                key={classroom.id}
                id={classroom.code}
                classroomName={classroom.classroomName}
                createdBy={classroom.createdBy}
              />
            ))}
          </div>
        </div>
         {showModal && (
        <CreateClassModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateClassroom}
          isSubmitting={isSubmitting}
        />
      )}
      </DefaultLayout>

     

    )
}
