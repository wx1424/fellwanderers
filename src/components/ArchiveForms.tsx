import React, { useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Archive from "../types/Archive";
import { Doc } from "../../firebaseAPI";

const inputStyle = "border border-gray-400 rounded px-3 py-1.5 w-full text-sm";
const btnStyle = "shadow-md inline-block px-3 py-1.5 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";

// ─── Resizable image node view ───────────────────────────────────────────────

function ResizableImageView({ node, updateAttributes, selected }: any) {
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startX.current = e.clientX;
    startW.current = imgRef.current?.offsetWidth ?? 400;

    const onMove = (ev: MouseEvent) => {
      const newW = Math.max(80, startW.current + (ev.clientX - startX.current));
      updateAttributes({ width: newW });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [updateAttributes]);

  const width = node.attrs.width ? `${node.attrs.width}px` : '100%';

  return (
    <NodeViewWrapper style={{ display: 'block', width, position: 'relative', margin: '1rem 0' }}>
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt ?? ''}
        draggable={false}
        style={{ width: '100%', display: 'block', borderRadius: '0.375rem' }}
        className={selected ? 'ring-2 ring-blue-400' : ''}
      />
      {selected && (
        <div
          onMouseDown={onHandleMouseDown}
          style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 12, height: 36, background: '#3b82f6', borderRadius: 4,
            cursor: 'col-resize', zIndex: 10,
          }}
        />
      )}
    </NodeViewWrapper>
  );
}

const ResizableImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;
    return ['img', mergeAttributes(rest, width ? { style: `width:${width}px` } : {})];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },

  addCommands() {
    return {
      setImage: (options: Record<string, unknown>) => ({ commands }: any) =>
        commands.insertContent({ type: 'image', attrs: options }),
    } as any;
  },
});

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${active ? 'bg-gray-300 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

// ─── Full-page form ───────────────────────────────────────────────────────────

type SetArchiveDocState = React.Dispatch<React.SetStateAction<Doc<Archive>[]>>;

interface ArchiveFormPageProps {
  initialDoc: Doc<Archive> | null;
  archiveDocs: Doc<Archive>[];
  onAdd: (archive: Archive, docs: Doc<Archive>[], setState: SetArchiveDocState) => void;
  onEdit: (updated: Doc<Archive>, oldOrder: number) => void;
  setArchiveDocs: SetArchiveDocState;
  onClose: () => void;
}

export default function ArchiveFormPage({ initialDoc, archiveDocs, onAdd, onEdit, setArchiveDocs, onClose }: ArchiveFormPageProps) {
  const mode = initialDoc === null ? 'add' : 'edit';
  const [title, setTitle] = useState(initialDoc?.data.title ?? '');
  const [thumbnail, setThumbnail] = useState(initialDoc?.data.thumbnail ?? '');
  const [order, setOrder] = useState(initialDoc?.data.order ?? archiveDocs.length + 1);
  const [route, setRoute] = useState(initialDoc?.data.route ?? '');
  const [link, setLink] = useState(initialDoc?.data.link ?? '');
  const [draft, setDraft] = useState(initialDoc?.data.draft ?? false);
  const [error, setError] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [imgBarOpen, setImgBarOpen] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, ResizableImage],
    content: initialDoc?.data.desc ?? '<p></p>',
    editorProps: {
      attributes: { class: 'min-h-[400px] px-4 py-3 focus:outline-none' },
    },
  });

  const insertImage = useCallback(() => {
    if (imgUrl.trim() && editor) {
      editor.chain().focus().insertContent({ type: 'image', attrs: { src: imgUrl.trim() } }).run();
      setImgUrl('');
      setImgBarOpen(false);
    }
  }, [imgUrl, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') { setError("Title cannot be empty"); return; }
    if (!editor || editor.isEmpty) { setError("Description cannot be empty"); return; }
    const archive: Archive = { title, thumbnail, desc: editor.getHTML(), order, route, draft };
    if (link.trim()) archive.link = link.trim();
    if (mode === 'add') {
      onAdd(archive, archiveDocs, setArchiveDocs);
    } else {
      onEdit({ ...initialDoc!, data: archive }, initialDoc!.data.order);
    }
    onClose();
  };

  const count = mode === 'add' ? archiveDocs.length + 1 : archiveDocs.length;
  const orderOptions = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">
          ✕ Cancel
        </button>
        <span className="font-bold text-lg flex-1 text-gray-800">
          {mode === 'add' ? 'Add Trip Report' : 'Edit Trip Report'}
        </span>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={draft} onChange={(e) => setDraft(e.target.checked)} className="w-4 h-4" />
          Draft
        </label>
        <button type="button" onClick={handleSubmit} className={btnStyle}>
          {mode === 'add' ? 'Publish' : 'Save'}
        </button>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div>
          <label className="block text-sm text-gray-700 mb-1 font-medium">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} placeholder="Trip report title" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-medium">Order</label>
            <select value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className={inputStyle}>
              {orderOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-medium">Map Link <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} className={inputStyle} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 font-medium">External Report Link <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className={inputStyle} placeholder="Link to PDF, Google Doc, etc." />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 font-medium">Card Thumbnail <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className={inputStyle} placeholder="Paste image URL for card preview" />
          {thumbnail && <img src={thumbnail} alt="thumbnail preview" className="mt-2 h-24 w-40 object-cover rounded border border-gray-200" />}
        </div>

        {/* Rich text editor */}
        <div>
          <label className="block text-sm text-gray-700 mb-1 font-medium">Description</label>
          <div className="border border-gray-400 rounded bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 rounded-t">
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')}>
                <span className="underline">U</span>
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>H2</ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })}>H3</ToolbarButton>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>• List</ToolbarButton>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <div className="flex items-center gap-1">
                <ToolbarButton onClick={() => setImgBarOpen((v) => !v)} active={imgBarOpen}>🖼 Image</ToolbarButton>
                {imgBarOpen && (
                  <>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertImage(); } }}
                      placeholder="Paste image URL and press Enter"
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs w-56"
                      autoFocus
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); insertImage(); }}
                      className="text-xs px-2 py-0.5 bg-logoGreen-light border border-logoGreen-dark rounded hover:bg-green-900/60 font-medium"
                    >
                      Insert
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Editor area */}
            <EditorContent
              editor={editor}
              className="[&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:my-2 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
