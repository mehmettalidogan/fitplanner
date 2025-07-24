import React, { useState, useRef } from 'react';

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Blog içeriğinizi yazın...",
  height = "400px"
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Link URL\'si girin:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Resim URL\'si girin:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    {
      command: 'bold',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      ),
      title: 'Kalın (Ctrl+B)'
    },
    {
      command: 'italic',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4L8 20m8-16l-2 16" />
        </svg>
      ),
      title: 'İtalik (Ctrl+I)'
    },
    {
      command: 'underline',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12M8 4v8a4 4 0 008 0V4" />
        </svg>
      ),
      title: 'Altı Çizili (Ctrl+U)'
    },
    {
      command: 'strikeThrough',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12m-6-8v16" />
        </svg>
      ),
      title: 'Üstü Çizili'
    },
    {
      command: 'formatBlock',
      value: 'h1',
      icon: <span className="font-bold text-lg">H1</span>,
      title: 'Başlık 1'
    },
    {
      command: 'formatBlock',
      value: 'h2',
      icon: <span className="font-bold">H2</span>,
      title: 'Başlık 2'
    },
    {
      command: 'formatBlock',
      value: 'h3',
      icon: <span className="font-bold text-sm">H3</span>,
      title: 'Başlık 3'
    },
    {
      command: 'formatBlock',
      value: 'p',
      icon: <span className="text-sm">P</span>,
      title: 'Paragraf'
    },
    {
      command: 'insertUnorderedList',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      title: 'Madde Listesi'
    },
    {
      command: 'insertOrderedList',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: 'Numaralı Liste'
    },
    {
      command: 'justifyLeft',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      ),
      title: 'Sola Hizala'
    },
    {
      command: 'justifyCenter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      title: 'Ortala'
    },
    {
      command: 'justifyRight',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
        </svg>
      ),
      title: 'Sağa Hizala'
    },
    {
      command: 'removeFormat',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: 'Formatı Temizle'
    }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => formatText(button.command, button.value)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Link button */}
          <button
            type="button"
            onClick={insertLink}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Link Ekle"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          
          {/* Image button */}
          <button
            type="button"
            onClick={insertImage}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Resim Ekle"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`p-2 rounded transition-colors ${
              isPreview 
                ? 'text-blue-600 bg-blue-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title={isPreview ? 'Düzenleme Moduna Geç' : 'Önizleme Moduna Geç'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {isPreview ? (
          // Preview Mode
          <div 
            className="p-4 prose max-w-none"
            style={{ height }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          // Edit Mode
          <div
            ref={editorRef}
            contentEditable
            className="p-4 focus:outline-none"
            style={{ 
              height,
              minHeight: height,
              maxHeight: '600px',
              overflowY: 'auto'
            }}
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
          />
        )}
        
        {/* Placeholder when empty */}
        {!value && !isPreview && (
          <div 
            className="absolute top-4 left-4 text-gray-400 pointer-events-none"
            style={{ fontSize: '16px' }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Footer with character count */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-sm text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            {value ? `${value.replace(/<[^>]*>/g, '').length} karakter` : '0 karakter'}
          </span>
          <span className="text-xs">
            {isPreview ? '👁️ Önizleme Modu' : '✏️ Düzenleme Modu'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor; 