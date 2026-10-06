import React from 'react';

/**
 * Renders question text with rich markdown formatting (bold, code pills, and structured numbered lists).
 */
export const FormattedQuestion = ({ text, className = '' }) => {
  if (!text) return null;

  // Render markdown inline formatting (bold, code, italics)
  const renderInline = (str) => {
    if (!str) return null;
    // Split by `code` and **bold**
    const tokens = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code 
            key={i} 
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] text-cyan-300 font-mono text-[0.88em] border border-white/[0.1] font-normal"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white tracking-wide">
            {token.slice(2, -2)}
          </strong>
        );
      }
      return token;
    });
  };

  // Check if question text has numbered sections like "1. ", "2. ", "3. "
  const firstNumIdx = text.search(/(?:^|\s)1\.\s+/);

  if (firstNumIdx !== -1) {
    const intro = text.substring(0, firstNumIdx).trim();
    const rest = text.substring(firstNumIdx).trim();
    
    // Split by numbered items (e.g. "1. ", "2. ", etc.)
    const parts = rest.split(/(?:^|\s)(?=\d+\.\s+)/).filter(Boolean);

    return (
      <div className={`space-y-3 ${className}`}>
        {intro && (
          <p className="text-slate-100 font-medium leading-relaxed text-sm sm:text-base">
            {renderInline(intro)}
          </p>
        )}
        <div className="space-y-2.5 pt-1">
          {parts.map((item, idx) => {
            const match = item.match(/^\s*(\d+)\.\s+(.*)$/s);
            const num = match ? match[1] : (idx + 1);
            const content = match ? match[2] : item;

            return (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-200 shadow-sm"
              >
                <span className="shrink-0 w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-bold text-xs flex items-center justify-center font-mono mt-0.5">
                  {num}
                </span>
                <div className="text-slate-200 text-xs sm:text-sm leading-relaxed flex-1">
                  {renderInline(content)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Handle standard newline paragraphs
  const paragraphs = text.split(/\n\s*\n|\n/).filter(Boolean);
  if (paragraphs.length > 1) {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-slate-100 font-medium leading-relaxed text-sm sm:text-base">
            {renderInline(p)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`text-slate-100 font-medium leading-relaxed text-sm sm:text-base ${className}`}>
      {renderInline(text)}
    </div>
  );
};

export default FormattedQuestion;
