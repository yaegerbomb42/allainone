import { jsPDF } from 'jspdf';
import fs from 'fs';

// 52 Real, High-Value Topics for HVAC
const HVAC_TOPICS = [
    { title: "1. PPE: Eye & Face Protection", desc: "Standard Z87.1 requirements for drilling, brazing, and refrigerant handling." },
    { title: "2. Ladder Safety: Extension & Setup", desc: "4:1 rule, securing the base, and 3-point contact at all times." },
    { title: "3. Ladder Safety: Step Ladders", desc: "Never stand on the top cap. Inspect spreaders and feet before use." },
    { title: "4. Rooftop Safety: Leading Edges", desc: "Warning line systems (6ft rule) and guardrail requirements." },
    { title: "5. Confined Spaces: Attics", desc: "Heat stress risks, comms procedures, and safe egress planning." },
    { title: "6. Confined Spaces: Crawlspaces", desc: "Checking for pests, standing water, and mold." },
    { title: "7. Heat Stress Management", desc: "Recognition of heat exhaustion vs stroke. Hydration protocols." },
    { title: "8. Hydration & Rest Cycles", desc: "Mandatory water breaks during high-heat index days." },
    { title: "9. Cold Stress & Hypothermia", desc: "Layering clothing and recognizing frostbite in outdoor units." },
    { title: "10. Driving: Defensive Basics", desc: "Following distance (4 seconds) and scanning intersections." },
    { title: "11. Driving: Backing Protocols", desc: "GOAL: Get Out And Look. Using a spotter when available." },
    { title: "12. Vehicle Maintenance", desc: "Daily tire, brake, and fluid checks to prevent breakdowns." },
    { title: "13. Electrical: Lockout/Tagout", desc: "Zero energy verification before opening any disconnect." },
    { title: "14. Electrical: Test Before Touch", desc: "Using a rated meter to verify absence of voltage. Never assume." },
    { title: "15. Electrical: GFCI Protection", desc: "Using GFCIs for all temporary power tools and extension cords." },
    { title: "16. Hand Tools: Inspection", desc: "Checking for mushroomed heads, cracked handles, and insulation." },
    { title: "17. Power Tools: Cord Safety", desc: "Inspecting cords for frays. Proper grounding pins." },
    { title: "18. Angle Grinder Safety", desc: "Guard positioning, RPM ratings, and face shield requirements." },
    { title: "19. Refrigerant: Phosgene Gas", desc: "Risks of brazing near refrigerant leaks. Ventilation required." },
    { title: "20. Cylinder Transport", desc: "Storing bottles upright and secured. Cap requirements." },
    { title: "21. Back Safety: The Power Zone", desc: "Lifting between knees and shoulders. Pivot with feet, don't twist." },
    { title: "22. Team Lifting Procedures", desc: "Communication for loads over 50lbs (compressors, motors)." },
    { title: "23. Material Handling Equipment", desc: "Using dollies and stair climbers for furnaces and air handlers." },
    { title: "24. HazCom: SDS Access", desc: "How to find Safety Data Sheets for coil cleaners and glues." },
    { title: "25. Coil Cleaner Safety", desc: "Acid vs Alkaline risks. PPE: Gloves and Goggles mandatory." },
    { title: "26. Asbestos Awareness", desc: "Identifying transite pipe and old duct tape. do not disturb." },
    { title: "27. Mold Safety Basics", desc: "PPE (N95) when working near suspected biological growth." },
    { title: "28. Respirable Crystalline Silica", desc: "Wet cutting methods for concrete/masonry drilling." },
    { title: "29. Fire Extinguishers: PASS", desc: "Pull, Aim, Squeeze, Sweep. Location and monthly checks." },
    { title: "30. Hot Work: Fire Watch", desc: "30-minute wait time after torch use. Fire extinguisher nearby." },
    { title: "31. Brazing Fume Ventilation", desc: "Using fans or exhaust to clear cadmium/fluoride fumes." },
    { title: "32. Compressed Gas Safety", desc: "Oxygen/Acetylene separation and regulator inspection." },
    { title: "33. Slips, Trips & Falls", desc: "Housekeeping: Clearing cords and debris from walk paths." },
    { title: "34. Customer Property Safety", desc: "Boot covers (shoe covers) and floor protection protocols." },
    { title: "35. Dog & Pet Safety", desc: "Confirming pets are verified secure before entering yards." },
    { title: "36. Insect Sting Hazards", desc: "Checking disconnects for wasp nests before opening." },
    { title: "37. Sharp Metal Handling", desc: "Cut-resistant gloves when handling ductwork and flashing." },
    { title: "38. First Aid: Cuts", desc: "Cleaning, bandaging, and reporting procedures for sheet metal cuts." },
    { title: "39. Eye Wash Protocol", desc: "Flushing eyes for 15 mins after chemical exposure." },
    { title: "40. First Aid Kit Check", desc: "Inventory review: Bandages, burn cream, and antiseptic." },
    { title: "41. Emergency Action Plan", desc: "Muster points and evacuation routes for the shop/jobsite." },
    { title: "42. Incident Reporting", desc: "Reporting 'Near Misses' to prevent future accidents." },
    { title: "43. Mental Health Awareness", desc: "Managing stress and fatigue during peak season." },
    { title: "44. Fatigue Management", desc: "Recognizing microsleeps and the dangers of long shifts." },
    { title: "45. Hearing Protection", desc: "Earplugs required for impact drills and high-noise areas." },
    { title: "46. Respiratory Protection", desc: "Fit testing basics and when to use N95 vs P100." },
    { title: "47. Fall Protection Basics", desc: "Harness inspection and tie-off points above 6 feet." },
    { title: "48. Scaffold Safety", desc: "Locking wheels on rolling towers. Planking requirements." },
    { title: "49. Trenching for Linesets", desc: "Call 811 before digging. 5ft rule for protection." },
    { title: "50. HazCom Refresher", desc: "Labeling secondary containers (spray bottles)." },
    { title: "51. Year-End Safety Review", desc: "Discussing the year's wins and areas for improvement." },
    { title: "52. Goal Setting", desc: "Setting safety targets for the upcoming year." }
];

const generateKeyArt = (doc) => {
    // Helper to generate key PDF
    const formData = {
        companyName: "Revenue Forge HVAC",
        trade: "HVAC",
        safetyOfficer: "Agent Yaeger",
        startDate: "2025-01-01"
    }

    const getWeekDate = (startStr, weekIndex) => {
        const date = new Date(startStr);
        date.setDate(date.getDate() + (weekIndex * 7));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // 1. COVER PAGE
    doc.setFillColor(17, 24, 39) // Brand Black
    doc.rect(0, 0, 210, 297, "F")

    doc.setTextColor(251, 191, 36) // Brand Yellow
    doc.setFontSize(40)
    doc.setFont(undefined, 'bold')
    doc.text("2025 SAFETY", 105, 100, null, null, "center")
    doc.text("SCHEDULE", 105, 115, null, null, "center")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont(undefined, 'normal')
    doc.text(`Prepared for: ${formData.companyName}`, 105, 140, null, null, "center")
    doc.text(`Safety Officer: ${formData.safetyOfficer}`, 105, 150, null, null, "center")
    doc.text(`Trade Focus: ${formData.trade}`, 105, 160, null, null, "center")
    doc.text("Generated by TurboToolbox.com", 105, 270, null, null, "center")

    // 2. SCHEDULE PAGES
    doc.addPage()
    doc.setTextColor(0, 0, 0)

    let y = 20
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text(`Weekly Safety Topics - ${formData.companyName}`, 20, y)

    y += 15

    // Table Header
    doc.setFillColor(240, 240, 240)
    doc.rect(15, y - 8, 180, 10, "F")
    doc.setFontSize(10)
    doc.text("DATE", 20, y)
    doc.text("TOPIC & DESCRIPTION", 50, y)
    doc.text("SIGNATURE", 160, y)
    y += 10

    doc.setFont(undefined, 'normal')
    doc.setFontSize(9)

    HVAC_TOPICS.forEach((topic, index) => {
        if (y > 270) {
            doc.addPage()
            y = 20
            // Re-draw Header on new page
            doc.setFont(undefined, 'bold')
            doc.setFontSize(18)
            doc.text(`Weekly Safety Topics (Cont.)`, 20, y)
            y += 15
            doc.setFillColor(240, 240, 240)
            doc.rect(15, y - 8, 180, 10, "F")
            doc.setFontSize(10)
            doc.text("DATE", 20, y)
            doc.text("TOPIC & DESCRIPTION", 50, y)
            doc.text("SIGNATURE", 160, y)
            y += 10
            doc.setFont(undefined, 'normal')
            doc.setFontSize(9)
        }

        const weekDate = getWeekDate(formData.startDate, index);

        doc.setFont(undefined, 'bold')
        doc.text(weekDate, 20, y)
        doc.text(topic.title, 50, y)

        doc.text("_______________________", 160, y)

        y += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(topic.desc, 50, y)
        doc.setTextColor(0, 0, 0)

        y += 10
    });
}

const doc = new jsPDF();
generateKeyArt(doc);
const artifactPath = '/Users/yaeger/.gemini/antigravity/brain/85d191b7-5b46-4693-9619-fa364ff16eb5/TurboToolbox_2025_Schedule.pdf';
doc.save(artifactPath);
console.log(`PDF Generated at: ${artifactPath}`);
