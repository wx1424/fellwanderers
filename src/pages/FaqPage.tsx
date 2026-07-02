import { Disclosure } from "@headlessui/react";
import { faChevronDown, faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import { setCollectionState, Doc, handleSaveChangesClick } from "../../firebaseAPI.ts";
import { Faq } from "../types/Faq.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import FaqFormPopup from "../components/FaqForms.tsx";

const handleAddFaqSubmit = (faq: Faq, faqDocs: Doc<Faq>[], setState: React.Dispatch<React.SetStateAction<Doc<Faq>[]>>) => {
  const newDoc: Doc<Faq> = { id: null, data: faq };
  if (faq.order <= faqDocs.length) {
    faqDocs.filter((doc) => doc.data.order >= faq.order).forEach((doc) => doc.data.order++);
  }
  faqDocs.push(newDoc);
  setState(faqDocs.sort((a, b) => a.data.order - b.data.order));
};

const handleEditFaqSubmit = (newFaq: Faq, oldOrder: number, faqDocs: Doc<Faq>[], setState: React.Dispatch<React.SetStateAction<Doc<Faq>[]>>) => {
  if (newFaq.order === oldOrder) {
    faqDocs.forEach((doc) => { if (doc.data.order === oldOrder) doc.data = newFaq; });
  } else {
    faqDocs.forEach((doc) => {
      if (doc.data.order === oldOrder) doc.data = newFaq;
      else if (doc.data.order === newFaq.order) doc.data.order = oldOrder;
    });
  }
  setState([...faqDocs.sort((a, b) => a.data.order - b.data.order)]);
};

interface FAQProps {
  faq: Faq;
  isLoggedIn: boolean;
  onEdit: (faq: Faq) => void;
  onDelete: (order: number) => void;
}

function FAQ({ faq, isLoggedIn, onEdit, onDelete }: FAQProps) {
  const { order, question, answer } = faq;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className="flex items-center gap-1">
            <Disclosure.Button className="flex flex-1 justify-between rounded-lg bg-logoGreen-light px-4 py-2 text-left text-sm font-medium text-black border border-logoGreen-dark hover:bg-logoGreen-light/70 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
              <span className="font-bold">{order.toString().concat(". ").concat(question)}</span>
              <FontAwesomeIcon icon={faChevronDown} className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-black ml-2 flex-shrink-0`} />
            </Disclosure.Button>
            {isLoggedIn && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                  className="text-gray-500 hover:text-gray-800 px-2 py-2"
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[80px] text-xs">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(faq); }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(order); }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
            {answer}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

interface CommitteeUpdatesProps {
  faqDocs: Doc<Faq>[];
  docsToDelete: Doc<Faq>[];
  onAddClick: () => void;
}

function FaqCommitteeUpdates({ faqDocs, docsToDelete, onAddClick }: CommitteeUpdatesProps) {
  const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";
  return (
    <div className="w-full px-4 lg:px-8">
      <div className="flex gap-2 mb-2 pt-4">
        <button className={btnStyle} onClick={onAddClick}><FontAwesomeIcon icon={faPlus} /> Add FAQ</button>
        <button className={btnStyle} onClick={() => handleSaveChangesClick<Faq>("faqs", faqDocs, docsToDelete)}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [faqDocs, setFaqDocs] = useState<Doc<Faq>[]>([]);
  const [docsToDelete, setDocsToDelete] = useState<Doc<Faq>[]>([]);
  const [activeFaq, setActiveFaq] = useState<Faq | null | 'add'>(null);
  const { isLoggedIn } = useAuth();

  // activeFaq === 'add' → show add popup; Faq → show edit popup; null → no popup
  const showPopup = activeFaq !== null;
  const popupFaq = activeFaq === 'add' ? null : activeFaq;

  useEffect(() => {
    setCollectionState<Faq>(
      "faqs",
      (a, b) => a.order - b.order,
      setFaqDocs,
      (a) => a,
      (a) => a as Faq
    );
  }, []);

  const handleDeleteFromItem = (order: number) => {
    const doc = faqDocs.find((d) => d.data.order === order) as Doc<Faq>;
    const remaining = faqDocs.filter((d) => d.data.order !== order);
    remaining.forEach((d) => { if (d.data.order > order) d.data.order--; });
    setFaqDocs([...remaining]);
    setDocsToDelete([...docsToDelete, doc]);
  };

  const handleEditFromItem = (newFaq: Faq, oldOrder: number) => {
    handleEditFaqSubmit(newFaq, oldOrder, faqDocs, setFaqDocs);
  };

  return (
    <>
      <PageHeader />
      {showPopup && (
        <FaqFormPopup
          initialFaq={popupFaq}
          faqDocs={faqDocs}
          onAdd={handleAddFaqSubmit}
          onEdit={handleEditFromItem}
          setFaqDocs={setFaqDocs}
          onClose={() => setActiveFaq(null)}
        />
      )}
      <div className="flex flex-col justify-start items-center sm:w-1/2 mx-auto h-screen sm:py-8">
        <h2 className="font-oblique w-full text-3xl font-helvetica-black tracking-tight text-black sm:text-4xl px-4 lg:px-8">
          Frequently asked questions
        </h2>
        <p className="w-full text-lg text-gray-600 px-4 lg:px-8 pt-4">
          If you don't find the answers you need here, e-mail us at{" "}
          <a href="mailto:fellsoc@imperial.ac.uk" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" target="_blank">
            fellsoc@imperial.ac.uk
          </a>
        </p>
        {isLoggedIn && (
          <FaqCommitteeUpdates
            faqDocs={faqDocs}
            docsToDelete={docsToDelete}
            onAddClick={() => setActiveFaq('add')}
          />
        )}
        <div className="flex flex-col space-y-5 w-full px-4 lg:px-8 py-4 lg:py-8 h-max-screen overflow-y-auto">
          {faqDocs.map(({ data }, index) => (
            <FAQ
              key={index}
              faq={data}
              isLoggedIn={isLoggedIn}
              onEdit={(faq) => setActiveFaq(faq)}
              onDelete={handleDeleteFromItem}
            />
          ))}
        </div>
      </div>
      <PageFooter />
    </>
  );
}
