# Masa Blog Writing Skill - README

## What is This?

This skill packages Masa's complete blog writing methodology into a format that Antigravity (and other AI coding agents) can read and execute autonomously.

## Directory Structure

```
masa_blog_writing/
├── SKILL.md              # Main instruction file (REQUIRED)
├── example_template.md   # Example article structure with annotations
└── README.md            # This file
```

## How to Use This Skill

### For Antigravity

When you want to write a blog article in Masa's voice:

1. **Invoke the skill by name**: "Use the Masa Blog Writing skill to write about [TOPIC]"
2. **Antigravity will**:
   - Read `SKILL.md` to load all guidelines
   - Access reference files from Obsidian Vault if available
   - Execute the 3-phase writing process
   - Generate: Outline → Article Body → Metadata JSON

### For Manual Usage

If manually prompting an AI:

1. Copy the contents of `SKILL.md`
2. Paste into your AI conversation
3. Add your topic: "Now write an article about: [テーマ]"

## Key Features of This Skill

✅ **Comprehensive tone guidelines**: Professional yet approachable, logical yet rhythmic  
✅ **Expression database**: Preferred and avoided phrases with examples  
✅ **Accuracy standards**: Fact-based authority markers for each domain (AI, Physio, Business)  
✅ **3-phase writing process**: Core identification → Logic construction → Writing strategy  
✅ **Structural templates**: Proven article structure with rhythm techniques  
✅ **Metadata automation**: JSON output for SEO and content management  

## What Makes This Different from Raw Prompts?

| Aspect | Raw Prompt (Obsidian) | Skill File |
|--------|----------------------|------------|
| **Format** | Human-readable instructions | AI-agent executable with YAML frontmatter |
| **Invocation** | Manual copy-paste by user | Autonomous by skill name |
| **Integration** | Standalone | Part of agent toolchain |
| **Discoverability** | Must remember filename | Listed in agent's skill directory |
| **Evolution** | Edit prompt file | Version-controlled with project |

## Reference Files

The skill references these files from your Obsidian Vault (read during execution):

- `c:\Users\masan\Documents\Obsidian Vault\90_人格\Masa_思考パターン.md`
- `c:\Users\masan\Documents\Obsidian Vault\90_人格\Masa_判断原則.md`
- `c:\Users\masan\Documents\Obsidian Vault\80_prompt\Masa_ブログ執筆プロンプト.md`
- `c:\Users\masan\Documents\Obsidian Vault\05_Resources\02_Marketing_SNS\ライティングとセールスのための戦略的インサイト.md`

**Note**: If these files are unavailable, the skill will still function using the core guidelines embedded in `SKILL.md`.

## Example Invocations

### Basic Usage
```
Use the Masa Blog Writing skill to write about "AI時代における職人の価値"
```

### With Specific Requirements
```
Use the Masa Blog Writing skill to write a 3000-character article about "理学療法士のキャリア戦略" 
with a focus on the "Practice > Theory" principle
```

### Outline Only
```
Use the Masa Blog Writing skill to create just an outline for "オーストラリア展開で学んだこと"
```

## Maintenance

To update this skill:

1. Edit `SKILL.md` with new guidelines or refined expressions
2. Update `example_template.md` if structural changes are made
3. Test with Antigravity: `Use the Masa Blog Writing skill to write about [test topic]`
4. Verify tone, rhythm, and accuracy against latest articles

## Version History

- **v1.0** (2026-01-30): Initial skill creation
  - Converted Masa_ブログ執筆プロンプト.md into skill format
  - Integrated thinking patterns and judgment principles
  - Added example template and usage instructions

---

**Created by**: Masa & Antigravity  
**Last Updated**: 2026-01-30  
**Status**: Production Ready ✅
