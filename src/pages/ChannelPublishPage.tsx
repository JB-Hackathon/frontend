import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";
import { channelPublishDummyData } from "@/data/featurePrototypeData";
import previewImage1 from "@/assets/card_01.svg";
import previewImage2 from "@/assets/card_02.svg";
import previewImage3 from "@/assets/card_03.svg";

const CARD_PREVIEW_IMAGES = [previewImage1, previewImage2, previewImage3];

export default function ChannelPublishPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = channelPublishDummyData;
  const [scheduleId, setScheduleId] = useState(data.selectedScheduleId);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(
    () =>
      new Set(
        data.channels
          .filter((channel) => channel.checked && !channel.disabled)
          .map((channel) => channel.id),
      ),
  );
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "done"
  >("idle");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isScheduled = scheduleId === "scheduled";
  const scheduledOption = data.scheduleOptions.find(
    (opt) => opt.id === "scheduled",
  );
  const scheduledDateTime = scheduledOption?.label.replace("예약 · ", "") ?? "";

  const selectedChannels = useMemo(
    () => data.channels.filter((channel) => selectedChannelIds.has(channel.id)),
    [data.channels, selectedChannelIds],
  );
  const hasSelectedChannel = selectedChannels.length > 0;

  function toggleChannel(channelId: string, disabled: boolean) {
    if (disabled) return;
    setSelectedChannelIds((prev) => {
      const next = new Set(prev);
      if (next.has(channelId)) next.delete(channelId);
      else next.add(channelId);
      return next;
    });
  }

  function handleSaveDraft() {
    const now = new Date();
    setDraftSavedAt(
      `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`,
    );
  }

  function handlePublish() {
    if (!hasSelectedChannel || publishState === "publishing") return;
    setPublishState("publishing");
    setTimeout(() => setPublishState("done"), 1400);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto w-full px-6 py-5 space-y-2">
          <Link
            to={`/content/${id}`}
            className="text-sm text-gray-400 hover:text-[#1B3A6B] transition-colors mb-4 inline-block"
          >
            ‹ 심의 결과
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-gray-400">
                  {data.managementNumber}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {data.statusLabel}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-white">
                  {data.flowLabel}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {draftSavedAt && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  임시 저장됨 · {draftSavedAt}
                </span>
              )}
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                임시 저장
              </button>
              <button
                onClick={handlePublish}
                disabled={!hasSelectedChannel || publishState === "publishing"}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1B3A6B]"
              >
                {publishState === "publishing" ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    게시 처리 중…
                  </>
                ) : (
                  <>{isScheduled ? "예약 게시 등록" : "Publish"}</>
                )}
              </button>
            </div>
          </div>
          {!hasSelectedChannel && (
            <p className="text-xs text-rose-500">
              게시할 채널을 1개 이상 선택해주세요.
            </p>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">게시할 콘텐츠</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.cards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setOpenCardIndex(index)}
                title="클릭하면 확대해서 볼 수 있어요"
                className="group relative aspect-[4/3] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:border-[#1B3A6B]/40 transition-colors"
              >
                <img
                  src={CARD_PREVIEW_IMAGES[index % CARD_PREVIEW_IMAGES.length]}
                  alt={card.label}
                  className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-black/55 text-white backdrop-blur-sm">
                  {card.label}
                </span>
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-white px-2.5 py-1 rounded-full bg-black/50">
                    크게 보기
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">{data.cardsNote}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-800">게시 캡션</h2>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {data.caption}
          </div>
          <p className="text-xs text-gray-400">{data.captionNote}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800">게시 채널</h2>
              <span className="text-xs text-gray-400">
                {selectedChannels.length}개 선택됨
              </span>
            </div>
            <button className="text-xs text-[#1B3A6B] font-medium hover:underline">
              채널 계정 관리 ›
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {data.channels.map((channel) => {
              const isSelected = selectedChannelIds.has(channel.id);
              return (
                <li
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id, channel.disabled)}
                  className={`flex items-center gap-3 py-3.5 transition-colors rounded-lg px-2 -mx-2 ${
                    channel.disabled
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={channel.disabled}
                    onChange={() => toggleChannel(channel.id, channel.disabled)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-[#1B3A6B] disabled:opacity-40"
                  />
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {channel.iconLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        channel.disabled ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {channel.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono truncate">
                      {channel.handle}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${
                      channel.badgeTone === "connected"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}
                  >
                    {channel.badgeLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">게시 시점</h2>
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {data.scheduleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setScheduleId(opt.id)}
                className={`px-4 py-2 font-medium transition-colors ${
                  scheduleId === opt.id
                    ? "bg-[#1B3A6B] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {isScheduled && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              선택한 채널에 {scheduledDateTime}에 자동으로 게시됩니다.
            </p>
          )}
        </div>
      </main>

      {openCardIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8"
          onClick={() => setOpenCardIndex(null)}
        >
          <img
            src={
              CARD_PREVIEW_IMAGES[openCardIndex % CARD_PREVIEW_IMAGES.length]
            }
            alt={data.cards[openCardIndex].label}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpenCardIndex(null)}
            title="닫기"
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {publishState === "done" && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 space-y-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">
                {isScheduled
                  ? "예약 게시가 등록되었습니다"
                  : "게시가 완료되었습니다"}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {selectedChannels.map((channel) => channel.name).join(", ")}
                {isScheduled
                  ? `에 ${scheduledDateTime}에 자동으로 게시됩니다.`
                  : "에 콘텐츠가 게시되었습니다."}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
            >
              내 콘텐츠에서 확인하기
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
