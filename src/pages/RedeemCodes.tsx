import { useEffect, useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import {
  getAllRedeemCodes,
  createRedeemCode,
  type RedeemCode,
} from "../api/redeemCodeApi";
// Adjust this path to wherever you put the component
import RewardContainer from "../components/redeem-codes/RewardContainer";

export default function RedeemCodes() {
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const fetchRedeemCodes = async () => {
    try {
      const data = await getAllRedeemCodes();
      setRedeemCodes(data);
    } catch (error) {
      console.error("Failed to fetch redeem codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedeemCodes();
  }, []);

  const handleCreateRedeemCode = async (id: string) => {
    if (!id) return;
    try {
      setCreatingId(id);
      await createRedeemCode(id);
      // Refresh so the new code shows up in the card
      await fetchRedeemCodes();
    } catch (err) {
      console.error("Failed to create redeem code:", err);
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#14532D]">Redeem Codes</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and view available CleanSweep redeem codes.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading redeem codes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && redeemCodes.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">No redeem codes found.</p>
          </div>
        )}

        {/* Redeem Codes */}
        {!loading && redeemCodes.length > 0 && (
          <RewardContainer
            redeemCodes={redeemCodes}
            onCreateRedeemCode={handleCreateRedeemCode}
            creatingId={creatingId}
          />
        )}
      </div>
    </DefaultLayout>
  );
}
