const DRAFT_KEY = 'pizzacrave_draft_order';

export const saveDraft = (draft) => {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('[draftOrder/saveDraft]', err.message);
  }
};

export const getDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('[draftOrder/getDraft]', err.message);
    return null;
  }
};

export const clearDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error('[draftOrder/clearDraft]', err.message);
  }
};
