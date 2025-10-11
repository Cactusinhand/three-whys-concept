<details>
<summary><strong>code is cheap, show me your prompt</strong> 📝</summary>

- 作者:   [李继刚](https://x.com/lijigang_com)
- 版本:   1.0
- 日期:   2025-10-10
- purpose: 遵循 Why-How-What 框架，对任意概念进行结构化、多层次的深度解析。

概念三问

【使用说明】
用户只需提供一个概念，你将自动执行以下三步分析，生成一个深刻、直观且结构化的解答。

🎯 第一步：追问其本 (The Why)
核心目标： 理解此概念为何存在。

执行动作： 首先阐明，这个概念的诞生，是为了解决什么领域里的哪个根本性问题或核心矛盾。这会提供一个最坚实的"认知之锚"，让用户明白我们为何需要它。

💡 第二步：建立直觉 (The How)
核心目标： 感性地"触摸"这个概念。

执行动作： 设计一个极其简单、生动的核心类比或微型情境。这个类比将剥离所有专业术语，旨在用日常生活中已有的经验，让用户瞬间"感觉"到这个概念是如何运作的。

🔧 第三步：系统化认知 (The What)
核心目标： 理性地"拆解"这个概念。

执行动作： 将这个概念拆解成一个微型心智模型，包含以下三个部分：

A. 核心构成： 它由哪几个最关键的部分组成？
B. 运作机制： 这几个部分之间是如何互动的？
C. 应用边界： 在什么情况下它适用？在什么情况下它不适用？

等待用户提供任何一个希望深入理解的概念，你将生成一份遵循此框架的、清晰易懂的解答。

</details>

# Concept Three-Whys Framework

A React + TypeScript application that performs deep concept analysis using the "Why-How-What" framework. This tool generates comprehensive, structured explanations for any concept, helping users understand not just what something is, but why it exists, how it works intuitively, and what its components and boundaries are.

## 🎯 Features

- **AI-Powered Analysis**: Generates detailed concept analyses using multiple AI providers (Gemini, OpenAI, DeepSeek) with intelligent fallback
- **Why-How-What Framework**: Systematic three-step analysis for deep understanding
- **Bilingual Support**: Full English/Chinese translation with seamless toggle functionality
- **Export Options**: Download analyses as images or share via URL
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Smart Provider Selection**: Automatically selects the best available AI provider with built-in fallback mechanism

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- An API key for one of the supported AI providers

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Cactusinhand/three-whys-concept.git
   cd three-whys-concept
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory:

   ```bash
   # Priority order: Gemini > OpenAI > DeepSeek

   # Option 1: Google Gemini (highest priority)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Option 2: OpenAI (fallback)
   OPENAI_API_KEY=your_openai_api_key_here

   # Option 3: DeepSeek (final fallback)
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Enter a Concept**: Type any concept you want to understand (e.g., "Blockchain", "Machine Learning", "Mindfulness")
2. **Generate Analysis**: Click "Analyze" to generate a comprehensive three-step analysis
3. **Explore the Framework**:
   - **Why**: Understand why the concept exists and what problem it solves
   - **How**: Get an intuitive analogy to grasp how it works
   - **What**: Learn about its components, mechanisms, and boundaries
4. **Toggle Languages**: Switch between English, Chinese, or bilingual view
5. **Export**: Download as an image or copy a share link

## 📋 Analysis Framework

Each generated analysis follows the proven "Why-How-What" framework:

### 🎯 The Why
- **Goal**: Explain why this concept exists
- **Action**: Clarify the fundamental problem or core tension it was created to solve
- **Purpose**: Provide a solid "cognitive anchor" for its necessity

### 💡 The How
- **Goal**: Create an intuitive, sensory understanding
- **Action**: Design a simple, vivid analogy or micro-scenario
- **Method**: Strip away jargon and use everyday experiences for instant comprehension

### 🔧 The What
- **Goal**: Systematically deconstruct the concept
- **Components**:
  - **A. Core Components**: What are its most critical constituent parts?
  - **B. Operating Mechanism**: How do these parts interact with each other?
  - **C. Application Boundaries**: When is it applicable? When is it not?

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Multiple providers with intelligent fallback (Google Gemini, OpenAI, DeepSeek)
- **Export**: html2canvas for image generation
- **Sharing**: URL-based sharing with compression (pako)
- **Deployment**: Cloudflare Pages ready

## 🌐 Deployment

### Cloudflare Pages (Recommended)

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**

   - Connect your GitHub repository to Cloudflare Pages
   - Use the following build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/`

3. **Set Environment Variables**
   Add your API keys in Cloudflare Pages dashboard:

   ```
   GEMINI_API_KEY=your_actual_api_key_here
   OPENAI_API_KEY=your_actual_api_key_here
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

### Environment Variables

| Variable | Description | Required |
| ------------------ | --------------------- | ------------------------ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ (or one of the others) |
| `OPENAI_API_KEY` | OpenAI API key | ✅ (or one of the others) |
| `DEEPSEEK_API_KEY` | DeepSeek API key | ✅ (or one of the others) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Prompt Design**: [李继刚](https://x.com/lijigang_com) - Creator of the innovative "Three-Whys Framework" that provides the foundation for this entire application
- Built with modern web technologies and AI capabilities
- Special thanks to the AI providers that make this project possible
- Inspired by the need for deeper, more structured understanding of complex concepts

---

*"Understanding concepts deeply requires knowing not just what they are, but why they exist, how they work, and where they belong."*
