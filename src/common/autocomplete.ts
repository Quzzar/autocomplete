// TODO: This function URL is relatively safe to expose to the public, it's rate limited.
//       However, we should move & change it if any abuse happens.
const AI_FUNCTION_URL = `https://msgback.azurewebsites.net/api/OpenAICompletion?code=URUj647XlDjbH1PMiOXrVZQi7OEoBGezlfnb5VOfOMeqAzFuD92TcQ==`;

export default async function autocompleteText(text: string, prev: string[]) {
  if (text.endsWith('..')) {
    const completeSentence = text.endsWith('...');

    // Remove dots
    if (completeSentence) {
      text = text.slice(0, -3);
    } else {
      text = text.slice(0, -2);
    }
    text = text.trim();

    const res = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: getPrompt(text, prev, completeSentence),
        model: 'gpt-4o',
      }),
    });
    const result = await res.text();

    // Failed to autocomplete
    if (result.includes('<failed>')) {
      return null;
    }

    if (completeSentence) {
      return {
        result: `${text} ${result}`,
        generated: result,
      };
    } else {
      // Remove any ending periods
      const word = result.replace(/\.$/, '');
      return {
        result: `${text} ${word}`,
        generated: word,
      };
    }
  } else {
    return null;
  }
}

function getPrompt(text: string, prev: string[], completeSentence: boolean) {
  if (completeSentence) {
    return `

    Given a sentence or paragraph, your job is to complete the current sentence. Be well spoken and creative with the completion, fitting of the context of the text. Only return the rest of the sentence to write.
    
    If you absolutely cannot complete the sentence, you may return "<failed>" instead.

    ${
      prev.length > 0
        ? `The following completions have already been deemed not good enough, don't repeat these:`
        : ``
    }
    ${prev.map((p) => `- ${p}`).join('\n')}
    
    # Text
    ${text}
    
    `.trim();
  } else {
    return `

    Given a sentence or paragraph, your job is to fill in the next single word to continue the thought. Be well spoken and creative with the next word, fitting of the context of the text. Only return the next single word to write.
    
    If you absolutely cannot give the next word, you may return "<failed>" instead.

    ${
      prev.length > 0
        ? `The following completions have already been deemed not good enough, don't repeat these:`
        : ``
    }
    ${prev.map((p) => `- ${p}`).join('\n')}
    
    # Text
    ${text}
    
    `.trim();
  }
}
