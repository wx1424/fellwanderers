import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import { db } from "../../firebase.ts";
import Archive from "../types/Archive.ts";

export default function ArchiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [archive, setArchive] = useState<Archive | null>(location.state?.archive ?? null);
  const [loading, setLoading] = useState(!location.state?.archive);

  useEffect(() => {
    if (!location.state?.archive && id) {
      getDoc(doc(db, "archive", id))
        .then((snap) => {
          if (snap.exists()) {
            const data = snap.data() as any;
            setArchive({
              ...data,
              thumbnail: data.thumbnail ?? data.images?.[0] ?? '',
              link: data.link ?? '',
            } as unknown as Archive);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  return (
    <>
      <PageHeader />
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate("/archive")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to trip reports
        </button>
        {loading && <p className="text-gray-400">Loading...</p>}
        {!loading && !archive && <p className="text-gray-500">Report not found.</p>}
        {archive && (
          <>
            {archive.thumbnail && (
              <img
                src={archive.thumbnail}
                alt={archive.title}
                className="w-full max-h-96 object-cover rounded-xl mb-6"
              />
            )}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h1 className="font-oblique text-3xl sm:text-4xl font-bold">{archive.title}</h1>
              {archive.route && (
                <a
                  href={archive.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-md flex-shrink-0 inline-block p-2 bg-logoGreen-light border-logoGreen-dark border font-semibold rounded-md hover:bg-green-900/60"
                >
                  <FontAwesomeIcon icon={faMapLocationDot} />
                </a>
              )}
            </div>
            {archive.link && (
              <a
                href={archive.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-8 shadow-md px-4 py-2 bg-logoGreen-light border border-logoGreen-dark text-sm font-semibold rounded-md hover:bg-green-900/60"
              >
                View report as external file ↗
              </a>
            )}
            <div
              className="prose-content text-base lg:text-lg leading-8 text-gray-700"
              dangerouslySetInnerHTML={{ __html: archive.desc }}
            />
          </>
        )}
      </div>
      <PageFooter />
    </>
  );
}
