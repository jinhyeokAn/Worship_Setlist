"use server";

import { getYoutubeVideoId } from "@/lib/youtube";
import type { Setlist } from "@/data/setlists";

const OWNER = "jinhyeokAn";
const REPO = "Worship_Setlist";
const BRANCH = "main";
const FILE_PATH = "data/setlists.json";

export type SubmitSetlistInput = {
  adminId: string;
  adminPassword: string;
  setlist: Setlist;
};

export type SubmitSetlistResult = { ok: true } | { ok: false; error: string };

export async function verifyAdmin(
  adminId: string,
  adminPassword: string,
): Promise<SubmitSetlistResult> {
  const expectedId = process.env.ADMIN_ID;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;

  if (!expectedId || !expectedPassword || !token) {
    return {
      ok: false,
      error:
        "관리자 기능이 아직 설정되지 않았습니다 (ADMIN_ID / ADMIN_PASSWORD / GITHUB_TOKEN 환경변수 필요).",
    };
  }
  if (adminId !== expectedId || adminPassword !== expectedPassword) {
    return { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }
  return { ok: true };
}

function validateSetlist(setlist: Setlist): string | null {
  if (!setlist.title.trim()) return "콘티 제목을 입력하세요.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(setlist.date)) return "날짜 형식이 올바르지 않습니다.";
  if (setlist.songs.length === 0) return "곡을 하나 이상 추가하세요.";
  for (const song of setlist.songs) {
    if (!song.title.trim()) return "곡 제목이 비어있는 항목이 있습니다.";
    if (!getYoutubeVideoId(song.url)) {
      return `유튜브 링크를 확인해주세요: ${song.url}`;
    }
  }
  return null;
}

export async function submitSetlist({
  adminId,
  adminPassword,
  setlist,
}: SubmitSetlistInput): Promise<SubmitSetlistResult> {
  const expectedId = process.env.ADMIN_ID;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;

  if (!expectedId || !expectedPassword || !token) {
    return {
      ok: false,
      error:
        "관리자 기능이 아직 설정되지 않았습니다 (ADMIN_ID / ADMIN_PASSWORD / GITHUB_TOKEN 환경변수 필요).",
    };
  }
  if (adminId !== expectedId || adminPassword !== expectedPassword) {
    return { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const validationError = validateSetlist(setlist);
  if (validationError) return { ok: false, error: validationError };

  const contentsUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const getRes = await fetch(contentsUrl, { headers, cache: "no-store" });
  if (!getRes.ok) {
    return { ok: false, error: `GitHub에서 기존 콘티를 불러오지 못했습니다 (${getRes.status}).` };
  }
  const getData = (await getRes.json()) as { content: string; sha: string };
  const current = JSON.parse(
    Buffer.from(getData.content, "base64").toString("utf-8"),
  ) as Setlist[];

  if (current.some((s) => s.id === setlist.id)) {
    return { ok: false, error: "같은 날짜의 콘티가 이미 등록되어 있습니다." };
  }

  const updated = [...current, setlist];
  const newContent = Buffer.from(JSON.stringify(updated, null, 2) + "\n", "utf-8").toString(
    "base64",
  );

  const putRes = await fetch(contentsUrl.split("?")[0], {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `콘티 추가: ${setlist.title}`,
      content: newContent,
      sha: getData.sha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    const body = await putRes.text();
    return { ok: false, error: `GitHub 저장에 실패했습니다 (${putRes.status}): ${body}` };
  }

  return { ok: true };
}
