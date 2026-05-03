import DefaultLayout from "../layout/DefaultLayout";

export default function Profile() {
  return (
    <>
      <DefaultLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0F172A]">Profile</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Edit your profile
            </p>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
