from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, MarianMTModel, MarianTokenizer
import PyPDF2
import re
import requests
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

# Load AI models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Simple user storage (use database in production)
users = {}

# Language translation models (cached)
translation_models = {}

def get_translator(target_lang):
    """Get or load translation model for target language"""
    lang_codes = {
        'spanish': 'en-es',
        'french': 'en-fr',
        'german': 'en-de',
    }
    
    if target_lang == 'english':
        return None
    
    model_code = lang_codes.get(target_lang)
    if not model_code:
        return None
    
    model_name = f'Helsinki-NLP/opus-mt-{model_code}'
    
    try:
        if target_lang not in translation_models:
            print(f"Loading translation model for {target_lang}: {model_name}")
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            translation_models[target_lang] = (tokenizer, model)
            print(f"✓ Successfully loaded {target_lang} model")
        return translation_models[target_lang]
    except Exception as e:
        print(f"✗ Error loading {target_lang} model: {str(e)}")
        return None

def translate_text(text, target_lang):
    """Translate text with MarianMT first, GoogleTranslator as fallback"""
    if target_lang == 'english':
        return text
    
    translator = get_translator(target_lang)
    if translator:
        tokenizer, model = translator
        try:
            max_length = 400
            chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]
            translated_chunks = []
            
            for chunk in chunks:
                inputs = tokenizer(chunk, return_tensors="pt", padding=True, truncation=True, max_length=512)
                translated = model.generate(**inputs, max_length=512)
                translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
                translated_chunks.append(translated_text)
            
            result = ' '.join(translated_chunks)
            print(f"✓ MarianMT translation successful for {target_lang}")
            return result
        except Exception as e:
            print(f"✗ MarianMT failed for {target_lang}: {str(e)}")
    
    try:
        lang_map = {
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'hindi': 'hi',
            'telugu': 'te',
            'tamil': 'ta',
            'kannada': 'kn',
            'bengali': 'bn',
            'malayalam': 'ml',
            'marathi': 'mr'
        }
        target_code = lang_map.get(target_lang, 'es')
        
        max_chunk_size = 4500
        if len(text) > max_chunk_size:
            chunks = [text[i:i+max_chunk_size] for i in range(0, len(text), max_chunk_size)]
            translated_chunks = []
            for chunk in chunks:
                translated = GoogleTranslator(source='en', target=target_code).translate(chunk)
                translated_chunks.append(translated)
            result = ' '.join(translated_chunks)
        else:
            result = GoogleTranslator(source='en', target=target_code).translate(text)
        
        print(f"✓ Google Translate successful for {target_lang}")
        return result
    except Exception as e:
        print(f"✗ Google Translate failed: {str(e)}")
        return text

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    
    if not email or not password or not name:
        return jsonify({"error": "All fields are required"}), 400
    
    if email in users:
        return jsonify({"error": "User already exists"}), 400
    
    users[email] = {"password": password, "name": name}
    return jsonify({"message": "Account created successfully", "name": name})

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if email not in users or users[email]["password"] != password:
        return jsonify({"error": "Invalid email or password"}), 401
    
    return jsonify({"message": "Login successful", "name": users[email]["name"]})

def enhance_text(text):
    """Enhance and correct short text"""
    text = text.strip()
    if text:
        text = text[0].upper() + text[1:]
        if not text.endswith(('.', '!', '?')):
            text += '.'
    return text

def elaborate_short_input(text, target_lang='english'):
    """Elaborate on very short inputs with intelligent expansion"""
    text = text.strip()
    
    name_match = re.search(r'i am ([a-zA-Z]+)', text, re.IGNORECASE)
    if name_match:
        name = name_match.group(1).capitalize()
        elaboration = (
            f"This sentence introduces a person named {name}. "
            f"'{name}' is a proper noun, typically used as a given name. "
            f"In linguistic terms, '{name}' functions as a noun in this sentence, specifically identifying an individual. "
            f"The name {name} may have cultural significance and is commonly found in various regions. "
            f"For a more comprehensive analysis or summary, please provide additional context about {name} or the subject matter."
        )
    else:
        words = text.split()
        if len(words) <= 2:
            potential_name = words[0].capitalize() if words else text.capitalize()
            elaboration = (
                f"The input '{potential_name}' appears to be a brief statement or possibly a name. "
                f"In grammatical terms, if '{potential_name}' is a name, it functions as a proper noun. "
                f"Proper nouns are used to identify specific people, places, or things. "
                f"To generate a more detailed summary, please provide additional information or context. "
                f"For example, you could include: What does {potential_name} represent? What is the context? "
                f"What would you like to know about {potential_name}?"
            )
        else:
            elaboration = (
                f"The statement '{enhance_text(text)}' is relatively brief. "
                f"This input contains {len(words)} word(s). "
                f"For NoteSnap to provide a comprehensive AI-powered summary with detailed analysis, "
                f"please provide more content. Longer texts allow for better summarization, "
                f"key point extraction, and meaningful insights."
            )
    
    if target_lang != 'english':
        elaboration = translate_text(elaboration, target_lang)
    
    return elaboration

@app.route("/summarize_text", methods=["POST"])
def summarize_text():
    data = request.get_json()
    text = data.get("text", "")
    target_lang = data.get("language", "english").lower()
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    enhanced_text = enhance_text(text)
    word_count = len(text.split())
    
    if word_count < 10:
        summary = elaborate_short_input(text, target_lang)
        corrected = enhanced_text
        note = "Short input detected—NoteSnap provided an elaborated explanation."
        
        if target_lang != 'english':
            corrected = translate_text(corrected, target_lang)
            note = translate_text(note, target_lang)
    else:
        try:
            summary_result = summarizer(enhanced_text, max_length=130, min_length=30, do_sample=False)
            summary = summary_result[0]["summary_text"]
            corrected = enhanced_text
            note = ""
        except:
            summary = enhanced_text
            corrected = enhanced_text
            note = ""
        
        if target_lang != 'english':
            summary = translate_text(summary, target_lang)
            corrected = translate_text(corrected, target_lang)
    
    return jsonify({
        "summary": summary,
        "corrected": corrected,
        "original": text,
        "note": note,
        "language": target_lang
    })

@app.route("/summarize_pdf", methods=["POST"])
def summarize_pdf():
    try:
        pdf_file = request.files["file"]
        target_lang = request.form.get("language", "english").lower()
        
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        for page in reader.pages:
            text += page.extract_text()
        
        if not text.strip():
            return jsonify({"error": "Could not extract text from PDF"}), 400
        
        word_count = len(text.split())
        page_count = len(reader.pages)
        
        if word_count < 10:
            summary_text = elaborate_short_input(text, target_lang)
            preview = f"PDF Content: {enhance_text(text)}"
            note = "The PDF contains minimal text—NoteSnap provided an elaborated explanation."
            
            if target_lang != 'english':
                preview = translate_text(preview, target_lang)
                note = translate_text(note, target_lang)
        
        elif word_count < 100:
            enhanced_text_content = enhance_text(text)
            
            summary_text = (
                f"📄 PDF Document Analysis\n\n"
                f"Document Statistics:\n"
                f"• Total Words: {word_count}\n"
                f"• Total Pages: {page_count}\n\n"
                f"Content Overview:\n{enhanced_text_content}\n\n"
                f"Analysis:\n"
                f"This document contains limited content, suggesting it may be a summary, note, or quick reference material. "
                f"The key topics appear to revolve around the main terms and concepts mentioned above. "
                f"Given its brief nature, this PDF likely serves a specific, focused purpose rather than comprehensive coverage.\n\n"
                f"Recommendation: For complete understanding, consider the broader context in which this document was created."
            )
            
            preview = enhanced_text_content
            note = "Medium-length PDF—Detailed analysis provided."
            
            if target_lang != 'english':
                summary_text = translate_text(summary_text, target_lang)
                preview = translate_text(preview, target_lang)
                note = translate_text(note, target_lang)
        
        else:
            text = text[:5000]
            enhanced_text_content = enhance_text(text)
            
            try:
                summary_result = summarizer(
                    enhanced_text_content, 
                    max_length=250,
                    min_length=80,
                    do_sample=False
                )
                base_summary = summary_result[0]["summary_text"]
                
                summary_text = (
                    f"📄 Comprehensive PDF Summary\n\n"
                    f"Document Information:\n"
                    f"• Pages: {page_count}\n"
                    f"• Approximate Words: {word_count}\n"
                    f"• Content Type: Informational Document\n\n"
                    f"Executive Summary:\n{base_summary}\n\n"
                    f"Key Insights:\n"
                    f"• The document provides detailed information on the subject matter discussed.\n"
                    f"• Content has been analyzed and condensed to highlight the most important points.\n"
                    f"• The structure suggests a formal or semi-formal document intended for reference or learning.\n\n"
                    f"Content Classification:\n"
                    f"Based on the text analysis, this appears to be an informational or educational document "
                    f"that covers specific topics in detail. The writing style and structure indicate it's meant "
                    f"for knowledge sharing or documentation purposes.\n\n"
                    f"💡 Note: For complete comprehension, reviewing the full PDF document is recommended."
                )
                
            except Exception as e:
                print(f"Summarization error: {str(e)}")
                summary_text = (
                    f"📄 PDF Document Analysis\n\n"
                    f"Document Statistics:\n"
                    f"• Pages: {page_count}\n"
                    f"• Words: {word_count}\n\n"
                    f"Content Preview:\n{enhanced_text_content[:400]}...\n\n"
                    f"Analysis:\n"
                    f"This PDF document contains substantial content spanning {page_count} page(s). "
                    f"The text discusses various aspects of the topic, providing detailed information and insights. "
                    f"The document structure suggests it's designed for informational or reference purposes.\n\n"
                    f"Key Points:\n"
                    f"• The content covers multiple aspects of the subject matter.\n"
                    f"• The document appears to be well-structured and organized.\n"
                    f"• Additional context may enhance understanding of specific sections.\n\n"
                    f"💡 Recommendation: Review the complete document for full details and context."
                )
            
            preview = enhanced_text_content[:700] + "..." if len(enhanced_text_content) > 700 else enhanced_text_content
            note = ""
            
            if target_lang != 'english':
                summary_text = translate_text(summary_text, target_lang)
                preview = translate_text(preview, target_lang)
        
        return jsonify({
            "summary": summary_text,
            "corrected": preview,
            "language": target_lang,
            "note": note
        })
    except Exception as e:
        return jsonify({"error": f"PDF processing error: {str(e)}"}), 400

def get_youtube_info(video_url):
    """Extract YouTube video info using direct method"""
    try:
        video_id = None
        if 'youtu.be' in video_url:
            video_id = video_url.split('/')[-1].split('?')[0]
        elif 'youtube.com' in video_url:
            if 'v=' in video_url:
                video_id = video_url.split('v=')[1].split('&')[0]
        
        if not video_id:
            return None, None, None
        
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        response = requests.get(oembed_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            title = data.get('title', 'YouTube Video')
            author = data.get('author_name', 'Unknown Creator')
            content = f"{title}. This YouTube video was created by {author}."
            return title, content, author
        
        return None, None, None
    except:
        return None, None, None

@app.route("/summarize_youtube", methods=["POST"])
def summarize_youtube():
    try:
        data = request.get_json()
        url = data.get("url", "")
        target_lang = data.get("language", "english").lower()
        
        if not url:
            return jsonify({"error": "No URL provided"}), 400
        
        title, content, author = get_youtube_info(url)
        
        if not title or not content:
            return jsonify({"error": "Could not fetch YouTube video information. Please check the URL."}), 400
        
        word_count = len(title.split())
        
        # For very short titles (1-3 words) - Highly elaborated
        if word_count <= 3:
            summary_text = (
                f"🎥 YouTube Video Analysis\n\n"
                f"Video Information:\n"
                f"• Title: '{title}'\n"
                f"• Creator: {author}\n"
                f"• Title Length: {word_count} word(s)\n\n"
                f"Title Analysis:\n"
                f"The concise title '{title}' suggests a focused, direct approach to the content. "
                f"In video marketing, short titles often indicate either:\n"
                f"• A well-known brand or personality\n"
                f"• A tutorial or how-to video\n"
                f"• A specific topic or concept\n\n"
                f"First Word Analysis:\n"
                f"The word '{title.split()[0]}' appears to be "
                f"{'a proper noun (possibly a name, brand, or specific term)' if title.split()[0][0].isupper() else 'a common term or action word'}. "
                f"This suggests the video likely {'introduces or showcases' if title.split()[0][0].isupper() else 'demonstrates or explains'} "
                f"the subject matter.\n\n"
                f"Content Prediction:\n"
                f"Based on the title structure and creator ({author}), this video probably:\n"
                f"• Provides visual content related to {title.lower()}\n"
                f"• Targets viewers interested in this specific topic\n"
                f"• May be part of a series or standalone piece\n\n"
                f"💡 Recommendation: Watch the video for complete context and visual understanding. "
                f"Video content often conveys more through visuals than text alone."
            )
        
        # For medium titles (4-8 words) - Detailed analysis
        elif word_count <= 8:
            enhanced_text_content = enhance_text(content)
            
            summary_text = (
                f"🎥 YouTube Video Summary\n\n"
                f"Video Metadata:\n"
                f"• Title: '{title}'\n"
                f"• Channel: {author}\n"
                f"• Title Complexity: {word_count} words\n\n"
                f"Content Analysis:\n"
                f"{enhanced_text_content}\n\n"
                f"The title structure indicates this is a moderately detailed video that likely covers "
                f"specific aspects of {title.lower()}. Videos with {word_count}-word titles typically:\n"
                f"• Provide focused content on a particular topic\n"
                f"• Include actionable information or demonstrations\n"
                f"• Target viewers with some knowledge of the subject\n\n"
                f"Viewer Expectations:\n"
                f"Based on the title, viewers can expect:\n"
                f"• Clear explanations or demonstrations\n"
                f"• Structured content with specific goals\n"
                f"• Visual aids and examples\n\n"
                f"💡 Note: This summary is based on video metadata. Watching provides full understanding."
            )
        
        # For longer titles (9+ words) - AI-powered analysis
        else:
            enhanced_text_content = enhance_text(content)
            
            try:
                summary_result = summarizer(enhanced_text_content, max_length=180, min_length=60, do_sample=False)
                base_summary = summary_result[0]["summary_text"]
                
                summary_text = (
                    f"🎥 Comprehensive YouTube Video Analysis\n\n"
                    f"Video Details:\n"
                    f"• Title: '{title}'\n"
                    f"• Creator: {author}\n"
                    f"• Title Type: Descriptive ({word_count} words)\n\n"
                    f"AI-Generated Summary:\n{base_summary}\n\n"
                    f"Content Insights:\n"
                    f"The detailed title suggests this is a comprehensive video covering multiple aspects. "
                    f"Longer titles indicate:\n"
                    f"• In-depth coverage of the topic\n"
                    f"• Specific target audience with defined interests\n"
                    f"• Educational or tutorial content\n\n"
                    f"Video Category:\n"
                    f"Based on the title and creator, this appears to be "
                    f"{'educational/tutorial' if any(word in title.lower() for word in ['how', 'guide', 'tutorial', 'learn']) else 'informational/entertainment'} "
                    f"content designed for viewers seeking detailed information.\n\n"
                    f"💡 Best Practice: Watch the video for visual demonstrations and complete context. "
                    f"Video format provides information that text summaries cannot fully capture."
                )
                
            except Exception as e:
                print(f"YouTube summarization error: {str(e)}")
                summary_text = (
                    f"🎥 YouTube Video Overview\n\n"
                    f"Video Information:\n"
                    f"• Title: '{title}'\n"
                    f"• Channel: {author}\n"
                    f"• Description: {enhanced_text_content}\n\n"
                    f"Analysis:\n"
                    f"This video, created by {author}, appears to cover topics related to {title.lower()}. "
                    f"The comprehensive title ({word_count} words) suggests detailed content that may include:\n"
                    f"• Step-by-step instructions or demonstrations\n"
                    f"• In-depth explanations of concepts\n"
                    f"• Visual examples and real-world applications\n\n"
                    f"Recommendation:\n"
                    f"For full understanding, viewing the complete video is essential. "
                    f"Video content provides visual and auditory learning that text cannot replicate.\n\n"
                    f"💡 Note: This analysis is based on publicly available metadata."
                )
        
        preview = content[:600] + "..." if len(content) > 600 else content
        
        if target_lang != 'english':
            summary_text = translate_text(summary_text, target_lang)
            preview = translate_text(preview, target_lang)
            title_translated = translate_text(title, target_lang)
        else:
            title_translated = title
        
        return jsonify({
            "summary": summary_text,
            "title": title_translated,
            "corrected": preview,
            "language": target_lang
        })
    except Exception as e:
        return jsonify({"error": f"YouTube processing error: {str(e)}"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
