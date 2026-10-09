import { useState } from "react";

import MaleRacoon from "../../assets/cosmetics/male racoon.png";
import FemaleRacoon from "../../assets/cosmetics/female raccoon.png";
import TrashToCash from "../../assets/cosmetics/trashtocash.png";
import Tuxedo from "../../assets/cosmetics/tuxedo.png";

import type { RedeemCode } from "../../api/redeemCodeApi";

type RewardContainerProps = {
  redeemCodes: RedeemCode[];
  onCreateRedeemCode: (id: string) => void;
  creatingId?: string | null;
};

type RewardImage = {
  id: string;
  image: string;
};

const images: RewardImage[] = [
  {
    id: "TESTWHOLE",
    image: MaleRacoon,
  },
  {
    id: "racoonf",
    image: FemaleRacoon,
  },
  {
    id: "trashtocash",
    image: TrashToCash,
  },
  {
    id: "tuxedo",
    image: Tuxedo,
  },
];

const getRewardTitle = (redeemCode: RedeemCode): string => {
  const rewardTypes = Object.keys(redeemCode.rewards);

  if (rewardTypes.length === 0) {
    return "Reward";
  }

  return rewardTypes.join(" + ");
};

export function RewardContainer({
  redeemCodes,
  onCreateRedeemCode,
  creatingId = null,
}: RewardContainerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      // Clear the label after 1.5 seconds if it still shows this code.
      setTimeout(() => {
        setCopiedCode((current) =>
          current === code ? null : current
        );
      }, 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
      {redeemCodes.map((redeemCode) => {
        const isCreating = creatingId === redeemCode.id;

        const rewardImage = images.find(
          (item) => item.id === redeemCode.id
        );

        return (
          <div
            key={redeemCode.id}
            className="bg-white rounded-xl shadow-md border border-[#BBF7D0] overflow-hidden w-full h-full min-h-[430px] flex flex-col"
          >
            <div className="px-4 py-3 flex flex-col flex-1">
              {/* Image */}
              <div className="flex justify-center items-center h-32 shrink-0">
                <img
                  className="w-32 h-32 object-contain"
                  src={rewardImage?.image ?? MaleRacoon}
                  alt={redeemCode.id}
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5 h-12 shrink-0">
                <h2 className="text-sm text-center font-bold text-[#14532D] truncate">
                  {redeemCode.id}
                </h2>

                <p className="text-[11px] text-center text-gray-500 truncate">
                  {getRewardTitle(redeemCode)}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-[#BBF7D0] my-3 shrink-0" />

              {/* Redeem Codes Section */}
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <h3 className="text-xs font-semibold text-[#14532D]">
                    Redeem Codes
                  </h3>

                  <span className="text-[10px] font-medium text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.5 rounded-full">
                    {redeemCode.codes.length} available
                  </span>
                </div>

                {/* Fixed-height Codes List */}
                <div className="h-28 overflow-y-auto pr-1 space-y-1.5">
                  {redeemCode.codes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] rounded-md px-2.5 py-1.5 h-8"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Ticket Icon */}
                        <div className="w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center shrink-0">
                          <svg
                            className="w-3 h-3 text-[#16A34A]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                          </svg>
                        </div>

                        <span className="font-mono text-xs font-semibold text-[#14532D] tracking-wide truncate">
                          {code}
                        </span>
                      </div>

                      {/* Copy Button */}
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[#16A34A] hover:text-[#14532D] transition-colors shrink-0 ml-2"
                        title={
                          copiedCode === code
                            ? "Copied!"
                            : "Copy code"
                        }
                        onClick={() => handleCopy(code)}
                      >
                        {copiedCode === code ? (
                          <>
                            <span className="text-[10px] font-medium">
                              Copied!
                            </span>

                            {/* Check Icon */}
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 bg-[#16A34A] hover:bg-[#14532D] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded-lg shadow-sm transition-all h-9 shrink-0"
                onClick={() => onCreateRedeemCode(redeemCode.id)}
                disabled={isCreating}
              >
                {!isCreating && (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}

                {isCreating ? "Generating..." : "Generate Code"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RewardContainer;