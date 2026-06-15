import fs from 'fs';
import path from 'path';

// Helper to extract array from file content
function extractArray(content, varName) {
  const startIndex = content.indexOf(varName);
  if (startIndex === -1) return null;
  
  // Find the = symbol first to skip type annotations like University[]
  const equalsIndex = content.indexOf('=', startIndex);
  if (equalsIndex === -1) return null;
  
  // Find the opening bracket [ after the = symbol
  const bracketIndex = content.indexOf('[', equalsIndex);
  if (bracketIndex === -1) return null;
  
  // Track brackets to find the closing bracket ]
  let bracketCount = 0;
  let endIndex = -1;
  for (let i = bracketIndex; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    else if (content[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex === -1) return null;
  
  const arrayStr = content.substring(bracketIndex, endIndex + 1);
  // Evaluate the array string to get the JS array
  return eval(`(${arrayStr})`);
}

try {
  // Read UniversityFilter.tsx
  const uniFilterPath = path.resolve('src/components/UniversityFilter.tsx');
  const uniContent = fs.readFileSync(uniFilterPath, 'utf8');
  const universities = extractArray(uniContent, 'const universities');
  
  // Read SuccessStories.tsx
  const storiesPath = path.resolve('src/components/SuccessStories.tsx');
  const storiesContent = fs.readFileSync(storiesPath, 'utf8');
  const stories = extractArray(storiesContent, 'const stories');
  
  if (!universities || !stories) {
    console.error('Failed to extract data arrays.');
    process.exit(1);
  }
  
  console.log(`Extracted ${universities.length} universities and ${stories.length} success stories.`);
  
  let sql = '-- Seed Data for Cloudflare D1 / SQLite\n\n';
  
  // Seed Universities
  sql += '-- Seed Universities\n';
  for (const uni of universities) {
    // Generate realistic requirements based on rank/country
    let feeMin = 15000;
    let feeMax = 35000;
    let minGpa = 60; // percentage
    let minIelts = 6.0;
    let minToefl = 80;
    let highlights = '["Intake: Sep, Jan", "Top Courses: Engineering, Business, IT"]';
    
    const countryLower = uni.country.toLowerCase();
    
    // Customize based on country and rank to make matches realistic
    if (uni.rank <= 3) {
      // Top rank: Elite
      feeMin = 38000;
      feeMax = 65000;
      minGpa = 80;
      minIelts = 7.0;
      minToefl = 100;
      highlights = '["Intake: Sep Only", "Top Courses: STEM, MBA, Law", "Elite Rank #1-3"]';
    } else if (uni.rank <= 10) {
      // High rank
      feeMin = 28000;
      feeMax = 48000;
      minGpa = 72;
      minIelts = 6.5;
      minToefl = 92;
      highlights = '["Intake: Sep, Jan", "Top Courses: Business, Computing, Engineering"]';
    } else if (uni.rank <= 25) {
      // Mid rank
      feeMin = 18000;
      feeMax = 32000;
      minGpa = 65;
      minIelts = 6.0;
      minToefl = 85;
      highlights = '["Intake: Sep, Jan, May", "Top Courses: Hospitality, IT, Management"]';
    } else {
      // Lower rank
      feeMin = 12000;
      feeMax = 22000;
      minGpa = 55;
      minIelts = 5.5;
      minToefl = 75;
      highlights = '["Intake: Rolling Admission", "Top Courses: General Arts, Commerce"]';
    }
    
    // Special country overrides
    if (countryLower.includes('germany')) {
      // Germany public universities have near-zero fees
      feeMin = 0;
      feeMax = 3000;
      minGpa = 70; // German public universities need high GPA
      minIelts = 6.5;
      minToefl = 90;
      highlights = '["Intake: Oct, Apr", "Top Courses: Engineering, Science (Public Waiver)"]';
    }
    
    const escape = (str) => str ? str.replace(/'/g, "''") : "";
    sql += `INSERT INTO universities (name, country, code, rank, domain, city, established, students, tuition_fee_min, tuition_fee_max, min_gpa_percent, min_ielts, min_toefl, highlights) VALUES ('${escape(uni.name)}', '${escape(uni.country)}', '${escape(uni.code)}', ${uni.rank}, '${escape(uni.domain)}', '${escape(uni.city)}', ${uni.established}, '${escape(uni.students)}', ${feeMin}, ${feeMax}, ${minGpa}, ${minIelts}, ${minToefl}, '${escape(highlights)}');\n`;
  }
  
  // Seed Success Stories
  sql += '\n-- Seed Success Stories\n';
  for (const story of stories) {
    const escape = (str) => str ? str.replace(/'/g, "''") : "";
    const timelineStr = JSON.stringify(story.timeline);
    sql += `INSERT INTO success_stories (name, avatar, destination, dest_flag, before_loc, before_status, before_ielts, after_uni, after_status, after_salary, quote, timeline) VALUES ('${escape(story.name)}', '${escape(story.avatar)}', '${escape(story.destination)}', '${escape(story.destFlag)}', '${escape(story.beforeLoc)}', '${escape(story.beforeStatus)}', '${escape(story.beforeIelts)}', '${escape(story.afterUni)}', '${escape(story.afterStatus)}', '${escape(story.afterSalary)}', '${escape(story.quote)}', '${escape(timelineStr)}');\n`;
  }
  
  const seedPath = path.resolve('db/seed.sql');
  fs.writeFileSync(seedPath, sql, 'utf8');
  console.log(`Successfully wrote SQL seeds to ${seedPath}`);
  
} catch (err) {
  console.error('Error during D1 data migration:', err);
}
