import DefaultLayout from "../layout/DefaultLayout";
import { getAllClassrooms } from "../api/classroomApi";
import ClassCard from "../components/classroom/ClassCard";
import { useEffect, useState } from "react";
import CreateClassModal from "../components/classroom/CreateClassModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createClassroomCode, getAdminName } from "../api/adminApi";

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admin, setAdmin] = useState<string>("");

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // auth.currentUser can be null on first render (page refresh),
  // so wait for Firebase to tell us who is signed in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdmin("");
        return;
      }
      try {
        const adminData = await getAdminName(user.uid);
        setAdmin(adminData?.username ?? "");
      } catch (error) {
        console.error("Failed to get admin name:", error);
      }
    });
    return unsubscribe;
  }, [auth]);

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

  // Compare who created the classroom with the logged-in admin.
  // If createdBy stores the uid instead of the username, compare to `uid`.
  const isCreatedByMe = (classroom: any) =>
    !!admin && classroom.createdBy === admin;

  const myClassrooms = classrooms.filter(isCreatedByMe);
  const otherClassrooms = classrooms.filter((c) => !isCreatedByMe(c));

  return (
    <DefaultLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Classrooms</h2>
              <p className="text-xs text-[#64748B]">
                {myClassrooms.length} yours · {otherClassrooms.length} others
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

        {/* My Classrooms */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-[#0F172A]">
              My Classrooms
            </h3>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
              {myClassrooms.length}
            </span>
          </div>

          {myClassrooms.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 py-8 text-center">
              <p className="text-sm text-[#64748B]">
                You haven't created any classrooms yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr items-stretch">
              {myClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="h-full min-h-[140px] [&>*]:h-full [&>*]:w-full"
                >
                  <ClassCard
                    id={classroom.code}
                    classroomName={classroom.classroomName}
                    createdBy={classroom.createdBy}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Other Classrooms (locked) */}
        {otherClassrooms.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Other Classrooms
              </h3>
              <span className="text-[10px] font-medium text-[#64748B] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                {otherClassrooms.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr items-stretch">
              {otherClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="relative h-full min-h-[140px] cursor-not-allowed select-none"
                  aria-disabled="true"
                  title={`Created by ${classroom.createdBy}. You can only enter your own classrooms.`}
                  // Capture phase: swallow clicks (and Enter/Space activation)
                  // before they ever reach the card's own handlers/links.
                  onClickCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="h-full opacity-60 grayscale-[30%] pointer-events-none [&>*]:h-full [&>*]:w-full">
                    <ClassCard
                      id={classroom.code}
                      classroomName={classroom.classroomName}
                      createdBy={classroom.createdBy}
                    />
                  </div>

                  {/* Lock badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 border border-gray-200 text-[#64748B] text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Not yours
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <CreateClassModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateClassroom}
          isSubmitting={isSubmitting}
        />
      )}
    </DefaultLayout>
  );
}
