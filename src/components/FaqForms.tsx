import React, { useState } from 'react';
import { Faq } from "../types/Faq";
import { Doc } from "../../firebaseAPI";

const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";
const inputStyle = "border border-gray-400 rounded px-3 py-1.5 w-full text-sm";

type SetFaqDocState = React.Dispatch<React.SetStateAction<Doc<Faq>[]>>;

interface FaqFormPopupProps {
  initialFaq: Faq | null;
  faqDocs: Doc<Faq>[];
  onAdd: (faq: Faq, docs: Doc<Faq>[], setState: SetFaqDocState) => void;
  onEdit: (newFaq: Faq, oldOrder: number) => void;
  setFaqDocs: SetFaqDocState;
  onClose: () => void;
}

export default function FaqFormPopup({ initialFaq, faqDocs, onAdd, onEdit, setFaqDocs, onClose }: FaqFormPopupProps) {
  const mode = initialFaq === null ? 'add' : 'edit';
  const [order, setOrder] = useState(initialFaq?.order ?? faqDocs.length + 1);
  const [question, setQuestion] = useState(initialFaq?.question ?? '');
  const [answer, setAnswer] = useState(initialFaq?.answer ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() === '') { setError("Question cannot be empty"); return; }
    if (answer.trim() === '') { setError("Answer cannot be empty"); return; }
    const faq: Faq = { order, question, answer };
    if (mode === 'add') {
      onAdd(faq, faqDocs, setFaqDocs);
    } else {
      onEdit(faq, initialFaq!.order);
    }
    onClose();
  };

  const count = mode === 'add' ? faqDocs.length + 1 : faqDocs.length;
  const orderOptions = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-900/40">
      <div className="bg-white w-80 sm:w-96 p-4 shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">{mode === 'add' ? 'Add FAQ' : 'Edit FAQ'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Number</label>
            <select value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className={inputStyle}>
              {orderOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Question</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className={inputStyle} />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Answer</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} className={inputStyle} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btnStyle}>{mode === 'add' ? 'Add' : 'Save'}</button>
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
