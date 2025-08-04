import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Helper Functions & Constants ---
const LOCAL_STORAGE_KEY = "react-bookmark-manager-bookmarks";

const AppIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-5 5a2 2 0 01-2.82 0l-7-7A2 2 0 013 8V3a2 2 0 012-2h2z"
    />
  </svg>
);

// --- Components ---

const BookmarkForm = ({ onAddBookmark, editingBookmark, onUpdateBookmark }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const isEditing = !!editingBookmark;

  useEffect(() => {
    if (isEditing) {
      setTitle(editingBookmark.title);
      setUrl(editingBookmark.url);
      setTags(editingBookmark.tags.join(", "));
    } else {
      setTitle("");
      setUrl("");
      setTags("");
    }
  }, [editingBookmark, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) {
      setError("Title and URL are required.");
      return;
    }
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const bookmarkData = {
      id: isEditing ? editingBookmark.id : Date.now(),
      title,
      url,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: isEditing
        ? editingBookmark.createdAt
        : new Date().toISOString(),
    };

    if (isEditing) {
      onUpdateBookmark(bookmarkData);
    } else {
      onAddBookmark(bookmarkData);
    }

    if (!isEditing) {
      setTitle("");
      setUrl("");
      setTags("");
    }
    setError("");
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isEditing ? "Edit Bookmark" : "Add New Bookmark"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Google"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://www.google.com"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., search, tools, work"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              onClick={() => onUpdateBookmark(null)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CancelIcon />
              <span className="ml-2">Cancel</span>
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? <CheckIcon /> : <PlusIcon />}
            <span className="ml-2">
              {isEditing ? "Update Bookmark" : "Add Bookmark"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

const BookmarkItem = ({ bookmark, onDeleteBookmark, onEditBookmark }) => {
  const { title, url, tags, createdAt } = bookmark;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-grow mb-4 sm:mb-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 break-all"
        >
          {title}
        </a>
        <p className="text-sm text-gray-500 break-all">{url}</p>
        <div className="mt-2 flex flex-wrap items-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center text-xs font-semibold text-gray-600 bg-gray-200 rounded-full px-2 py-1 mr-2 mt-1"
            >
              <TagIcon /> {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-row sm:flex-col items-center space-x-2 sm:space-x-0 sm:space-y-2">
        <p className="text-xs text-gray-400 mb-2 hidden sm:block">
          {formattedDate}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => onEditBookmark(bookmark)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDeleteBookmark(bookmark.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

const BookmarkList = ({ bookmarks, onDeleteBookmark, onEditBookmark }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700">
          No Bookmarks Yet!
        </h3>
        <p className="text-gray-500 mt-2">
          Use the form above to add your first bookmark.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDeleteBookmark={onDeleteBookmark}
          onEditBookmark={onEditBookmark}
        />
      ))}
    </ul>
  );
};

const Header = () => (
  <header className="bg-white shadow-md mb-8 rounded-xl">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
      <AppIcon className="w-8 h-8 text-indigo-600" />
      <h1 className="text-3xl font-bold text-gray-800 ml-3">
        Bookmark Manager
      </h1>
    </div>
  </header>
);

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  activeTag,
  setActiveTag,
  allTags,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Filter by Tag:
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                !activeTag
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  activeTag === tag
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to parse bookmarks from localStorage", error);
      setBookmarks([]);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage", error);
    }
  }, [bookmarks]);

  const handleAddBookmark = useCallback((newBookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev]);
  }, []);

  const handleDeleteBookmark = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  }, []);

  const handleEditBookmark = useCallback((bookmark) => {
    setEditingBookmark(bookmark);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleUpdateBookmark = useCallback((updatedBookmark) => {
    if (updatedBookmark === null) {
      setEditingBookmark(null);
      return;
    }
    setBookmarks((prev) =>
      prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
    );
    setEditingBookmark(null);
  }, []);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    bookmarks.forEach((bm) => bm.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((bm) => {
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = bm.title.toLowerCase().includes(searchTermLower);
        const urlMatch = bm.url.toLowerCase().includes(searchTermLower);
        return titleMatch || urlMatch;
      })
      .filter((bm) => {
        if (!activeTag) return true;
        return bm.tags.includes(activeTag);
      });
  }, [bookmarks, searchTerm, activeTag]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        <Header />
        <main>
          <BookmarkForm
            onAddBookmark={handleAddBookmark}
            editingBookmark={editingBookmark}
            onUpdateBookmark={handleUpdateBookmark}
          />
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            allTags={allTags}
          />
          <BookmarkList
            bookmarks={filteredBookmarks}
            onDeleteBookmark={handleDeleteBookmark}
            onEditBookmark={handleEditBookmark}
          />
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            I've seen the future. It's you, a week from now, frantically trying
            to remember the name of a website. Save yourself the trouble and
            bookmark it.
          </p>
        </footer>
      </div>
    </div>
  );
}
