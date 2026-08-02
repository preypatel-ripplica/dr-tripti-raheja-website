"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check, Clock, Phone } from "@/components/Icons";
import { contact } from "@/lib/site";
import styles from "./InteractiveCare.module.css";

type ConcernGuideItem = {
  label: string;
  cue: string;
  fit: string;
  reassurance: string;
  questions: {
    prompt: string;
    options: string[];
  }[];
  nextSteps: string[];
  bring: string[];
};

type Urgency = "routine" | "soon" | "urgent";
type GuideStep = 0 | 1 | 2;

const concernGuide: ConcernGuideItem[] = [
  {
    label: "Pregnancy feels high-risk",
    cue: "Blood pressure, diabetes, twins, previous loss or extra monitoring",
    fit: "Start with a high-risk pregnancy consultation so your trimester plan, scans and warning signs are reviewed early.",
    reassurance: "Most high-risk pregnancies are managed with closer monitoring, a clear test calendar and a delivery plan.",
    questions: [
      {
        prompt: "What is the main reason you feel extra monitoring may be needed?",
        options: ["Blood pressure or diabetes", "Twin pregnancy", "Previous pregnancy loss", "Doctor advised closer care"],
      },
      {
        prompt: "Where are you in the pregnancy journey?",
        options: ["First trimester", "Second trimester", "Third trimester", "Planning pregnancy"],
      },
    ],
    nextSteps: ["Review pregnancy history", "Map scan and test schedule", "Plan delivery support"],
    bring: ["Previous prescriptions", "Recent scans", "Blood pressure or sugar notes"],
  },
  {
    label: "Heavy bleeding or fibroids",
    cue: "Pain, heavy periods, pelvic pressure or fertility concerns",
    fit: "A fibroid and fertility review helps decide whether observation, medicines or a uterus-preserving procedure is appropriate.",
    reassurance: "Treatment depends on symptoms, fibroid position, hemoglobin levels and whether pregnancy is planned.",
    questions: [
      {
        prompt: "Which symptom is affecting you most?",
        options: ["Heavy bleeding", "Pelvic pain or pressure", "Fertility planning", "Fibroid seen on scan"],
      },
      {
        prompt: "What do you most want clarity on?",
        options: ["Whether surgery is needed", "Fertility-safe options", "Bleeding control", "Understanding reports"],
      },
    ],
    nextSteps: ["Understand symptom severity", "Review ultrasound findings", "Discuss fertility goals"],
    bring: ["Pelvic ultrasound", "Cycle notes", "Hemoglobin or thyroid reports"],
  },
  {
    label: "Keyhole surgery opinion",
    cue: "Ovarian cyst, endometriosis, pelvic pain or laparoscopy advice",
    fit: "A laparoscopic surgery consult can clarify whether minimally invasive surgery is needed and what recovery may look like.",
    reassurance: "The decision is usually based on diagnosis, symptom burden, scan findings and recovery expectations.",
    questions: [
      {
        prompt: "What are you trying to decide?",
        options: ["Need for surgery", "Recovery time", "Second opinion", "Pain diagnosis"],
      },
      {
        prompt: "What report or diagnosis do you already have?",
        options: ["Ovarian cyst", "Endometriosis", "Pelvic infection or pain", "No confirmed diagnosis"],
      },
    ],
    nextSteps: ["Confirm diagnosis", "Compare treatment options", "Prepare for recovery"],
    bring: ["Ultrasound or MRI", "Medication list", "Prior surgery records"],
  },
  {
    label: "Uterus lining check",
    cue: "Irregular bleeding, polyp, miscarriage history or hysteroscopy query",
    fit: "A hysteroscopy review is useful when the inside of the uterus needs direct evaluation or a small corrective procedure.",
    reassurance: "The consultation clarifies whether a direct uterine-cavity look is needed and how the procedure is planned.",
    questions: [
      {
        prompt: "What prompted the hysteroscopy discussion?",
        options: ["Irregular bleeding", "Polyp or fibroid suspected", "Miscarriage evaluation", "IUD or cavity concern"],
      },
      {
        prompt: "What would you like explained first?",
        options: ["Why it is needed", "Pain or anaesthesia", "Same-day treatment", "Recovery after procedure"],
      },
    ],
    nextSteps: ["Review bleeding pattern", "Assess uterine cavity", "Plan same-day procedure if suitable"],
    bring: ["Cycle dates", "Ultrasound", "Previous biopsy reports"],
  },
  {
    label: "Not sure where to start",
    cue: "You have symptoms but are unsure which treatment page fits",
    fit: "Book a general gynaecology consultation. The team can route you to the right investigation or treatment pathway after listening to your concern.",
    reassurance: "You do not need to self-diagnose before calling. A clear symptom story is enough to begin.",
    questions: [
      {
        prompt: "What kind of concern is closest?",
        options: ["Pregnancy related", "Periods or bleeding", "Pain or swelling", "Trying to conceive"],
      },
      {
        prompt: "What would make the visit feel useful?",
        options: ["Know what tests are needed", "Understand treatment choices", "Get reassurance", "Plan next steps"],
      },
    ],
    nextSteps: ["Share symptoms clearly", "Discuss urgency", "Get a personalised plan"],
    bring: ["Any available reports", "Current medicines", "Questions you want answered"],
  },
];

const urgencyCopy: Record<Urgency, { label: string; summary: string }> = {
  routine: {
    label: "Planning ahead",
    summary: "Suitable when symptoms are stable and you mainly want clarity, planning or a second opinion.",
  },
  soon: {
    label: "Prefer this week",
    summary: "Useful when symptoms are affecting daily life, reports are concerning, or pregnancy needs closer review.",
  },
  urgent: {
    label: "Call today",
    summary: "If symptoms feel intense, sudden, or worrying, call the clinic today. For severe bleeding, fainting, fever or reduced baby movements, seek urgent medical care.",
  },
};

type PrepConcern = {
  label: string;
  line: string;
  image: string;
  hint: string;
  bring: string[];
  goals: {
    label: string;
    script: string;
    questions: string[];
  }[];
};

const prepConcerns: PrepConcern[] = [
  {
    label: "Pregnancy",
    line: "my pregnancy care",
    image: "/images/1-1.png",
    hint: "Antenatal care, scan review, delivery planning or warning signs.",
    bring: ["Antenatal file", "Latest scan", "BP or sugar notes"],
    goals: [
      {
        label: "Know what to watch",
        script: "I want to understand what is normal, what is not, and when I should call.",
        questions: ["What signs should I not ignore?", "How often should I follow up?", "Which reports should I bring?"],
      },
      {
        label: "Review reports",
        script: "I have reports and want help understanding what they mean.",
        questions: ["Is anything in my report concerning?", "Do I need another test?", "What is the next safe step?"],
      },
      {
        label: "Plan delivery",
        script: "I want to understand how delivery planning should happen from here.",
        questions: ["When should delivery planning begin?", "What should I prepare now?", "Which hospital visit is needed?"],
      },
    ],
  },
  {
    label: "Fibroid / fertility",
    line: "fibroid, periods or fertility concerns",
    image: "/images/11.jpg",
    hint: "Periods, fibroids, fertility planning or report review.",
    bring: ["Ultrasound", "Cycle dates", "Hormone reports"],
    goals: [
      {
        label: "Understand options",
        script: "I want to know what options I have and what can wait.",
        questions: ["Can this be managed without surgery?", "Will this affect pregnancy plans?", "What should I do first?"],
      },
      {
        label: "Reduce symptoms",
        script: "My symptoms are affecting daily life and I want relief.",
        questions: ["What can reduce bleeding or pain?", "Do I need urgent care?", "What report matters most?"],
      },
      {
        label: "Plan pregnancy",
        script: "I want to plan pregnancy safely with this concern in mind.",
        questions: ["Can I start trying now?", "Do fibroids affect my chances?", "Which tests should we do first?"],
      },
    ],
  },
  {
    label: "Surgery opinion",
    line: "a possible procedure or surgery opinion",
    image: "/images/9.jpg",
    hint: "Laparoscopy, hysteroscopy, recovery or second opinion.",
    bring: ["Scan report", "Medicine list", "Old discharge papers"],
    goals: [
      {
        label: "Know if needed",
        script: "I want to understand whether surgery is actually needed.",
        questions: ["What happens if I wait?", "Are there non-surgical options?", "How urgent is this?"],
      },
      {
        label: "Compare methods",
        script: "I want to compare the safest treatment approach.",
        questions: ["Can this be done with small cuts?", "What are the pros and cons?", "What would you recommend for me?"],
      },
      {
        label: "Plan recovery",
        script: "I want to understand recovery before making a decision.",
        questions: ["How much rest will I need?", "Will I need hospital admission?", "When can I return to routine?"],
      },
    ],
  },
];

const treatmentPaths: Record<
  string,
  {
    title: string;
    intro: string;
    steps: {
      label: string;
      question: string;
      helper: string;
      options: { label: string; note: string }[];
    }[];
    bring: string[];
    outcomes: string[];
  }
> = {
  "high-risk-pregnancy": {
    title: "Plan your pregnancy visit",
    intro: "Pick what matters most so the visit can focus on the right things.",
    steps: [
      {
        label: "Stage",
        question: "Where are you right now?",
        helper: "This helps shape what needs attention first.",
        options: [
          { label: "First trimester", note: "Dating scan, baseline tests and early risk review." },
          { label: "Second trimester", note: "Anomaly scan, growth plan and symptom monitoring." },
          { label: "Third trimester", note: "Delivery readiness, baby growth and warning signs." },
          { label: "Planning pregnancy", note: "Preconception risks, medicines and safer planning." },
        ],
      },
      {
        label: "Risk",
        question: "Why do you need closer care?",
        helper: "Choose the closest reason.",
        options: [
          { label: "Blood pressure", note: "Discuss home monitoring, medicines and warning symptoms." },
          { label: "Diabetes / sugar", note: "Review sugar logs, diet plan and fetal growth monitoring." },
          { label: "Twins / IVF pregnancy", note: "Plan closer scans and delivery timing discussion." },
          { label: "Previous complication", note: "Bring old records so the plan can be adjusted early." },
          { label: "Doctor advised closer care", note: "Understand why extra monitoring was suggested." },
        ],
      },
      {
        label: "Goal",
        question: "What do you want clarity on?",
        helper: "This becomes the visit focus.",
        options: [
          { label: "Scan and test calendar", note: "A week-by-week plan of what needs tracking." },
          { label: "Warning sign clarity", note: "Know when to call, visit or seek urgent care." },
          { label: "Delivery planning", note: "Discuss hospital readiness and likely delivery pathway." },
          { label: "Second opinion", note: "Review current advice and understand the safest options." },
        ],
      },
    ],
    bring: ["Antenatal file", "Latest ultrasound", "BP / sugar logs", "Previous pregnancy records"],
    outcomes: ["Monitoring schedule", "Risk-specific precautions", "Delivery or follow-up plan"],
  },
  "laparoscopic-surgery": {
    title: "Plan your laparoscopy discussion",
    intro: "Choose what you need answered before deciding on surgery.",
    steps: [
      {
        label: "Reason",
        question: "What brought up laparoscopy?",
        helper: "Pick the closest reason.",
        options: [
          { label: "Ovarian cyst", note: "Review size, appearance, symptoms and whether observation is safe." },
          { label: "Endometriosis symptoms", note: "Discuss pain pattern, fertility goals and treatment choices." },
          { label: "Pelvic pain", note: "Clarify possible causes before deciding on surgery." },
          { label: "Infertility workup", note: "Understand whether laparoscopy adds useful information." },
          { label: "Second opinion", note: "Compare surgery, medicines and watchful waiting." },
        ],
      },
      {
        label: "Decision",
        question: "What feels unclear?",
        helper: "Choose the main doubt.",
        options: [
          { label: "Do I need surgery?", note: "Ask what happens if you wait and what makes surgery necessary." },
          { label: "Can it be keyhole?", note: "Understand whether minimally invasive surgery is suitable." },
          { label: "Will fertility be affected?", note: "Discuss ovary/uterus preservation and timing." },
          { label: "What are the risks?", note: "Talk through safety, recovery and what could go wrong." },
        ],
      },
      {
        label: "Recovery",
        question: "What do you need to plan around?",
        helper: "Keep it practical.",
        options: [
          { label: "Time off work", note: "Ask about rest days and return to routine." },
          { label: "Pain control", note: "Understand expected pain and medicines after surgery." },
          { label: "Hospital stay", note: "Clarify day-care versus admission." },
          { label: "Follow-up and reports", note: "Know when stitches/reports are reviewed." },
        ],
      },
    ],
    bring: ["Ultrasound / MRI", "Previous surgery notes", "Current medicines", "Pain timeline"],
    outcomes: ["Surgery-vs-waiting decision", "Recovery estimate", "Pre-op next steps"],
  },
  "infertility-treatment": {
    title: "Plan your fertility or fibroid visit",
    intro: "Choose the concern so the discussion stays clear.",
    steps: [
      {
        label: "Priority",
        question: "What matters most right now?",
        helper: "Start with the biggest concern.",
        options: [
          { label: "Trying to conceive", note: "Focus on fertility-safe investigations and timing." },
          { label: "Heavy bleeding", note: "Review anemia risk, cycle pattern and treatment urgency." },
          { label: "Fibroid on scan", note: "Discuss size, location and whether it affects fertility." },
          { label: "Pain / pressure", note: "Connect symptoms with fibroid position or other causes." },
        ],
      },
      {
        label: "Timeline",
        question: "What is your timeline?",
        helper: "Timing changes the options.",
        options: [
          { label: "Immediately trying", note: "Review timing, basic fertility reports and fibroid impact." },
          { label: "In the next year", note: "Plan treatment without losing time." },
          { label: "Not planning pregnancy", note: "Focus on comfort, bleeding control and long-term health." },
          { label: "Unsure", note: "Understand options without committing." },
        ],
      },
      {
        label: "Choice",
        question: "What answer do you need?",
        helper: "This shapes the plan.",
        options: [
          { label: "Can medicines help?", note: "Ask what can improve symptoms without surgery." },
          { label: "Is myomectomy needed?", note: "Discuss fibroid removal and uterus preservation." },
          { label: "Will fertility improve?", note: "Clarify what treatment can and cannot change." },
          { label: "What tests next?", note: "Leave with a clear investigation order." },
        ],
      },
    ],
    bring: ["Pelvic ultrasound", "Cycle notes", "Hormone reports", "Partner reports if available"],
    outcomes: ["Fertility-focused plan", "Fibroid treatment comparison", "Next test list"],
  },
  "hysteroscopy-treatment": {
    title: "Plan your hysteroscopy discussion",
    intro: "Choose what you need explained before the visit.",
    steps: [
      {
        label: "Trigger",
        question: "Why was hysteroscopy suggested?",
        helper: "Pick the closest reason.",
        options: [
          { label: "Irregular bleeding", note: "Discuss pattern, medication history and lining evaluation." },
          { label: "Polyp suspected", note: "Understand whether removal can happen in the same sitting." },
          { label: "Repeated miscarriage", note: "Review cavity shape, adhesions and relevant reports." },
          { label: "IUD / coil concern", note: "Clarify position, removal plan and discomfort expectations." },
          { label: "Scan finding unclear", note: "Use hysteroscopy to directly inspect the cavity if needed." },
        ],
      },
      {
        label: "Comfort",
        question: "What worries you most?",
        helper: "It is okay to ask simple questions.",
        options: [
          { label: "Pain control", note: "Ask what you may feel and how discomfort is managed." },
          { label: "Same-day treatment", note: "Clarify whether polyp/fibroid treatment is possible then." },
          { label: "Bleeding afterwards", note: "Know what spotting is expected and when to call." },
          { label: "Time required", note: "Plan the day around procedure and recovery time." },
        ],
      },
      {
        label: "After",
        question: "What should be clear after?",
        helper: "Choose what you want to leave knowing.",
        options: [
          { label: "Biopsy/report review", note: "Know when results return and what they mean." },
          { label: "Fertility next steps", note: "Connect cavity findings to pregnancy planning." },
          { label: "Bleeding treatment plan", note: "Decide medicines, procedure or monitoring." },
          { label: "Return to routine", note: "Clarify work, travel and activity guidance." },
        ],
      },
    ],
    bring: ["Ultrasound", "Cycle dates", "Previous biopsy reports", "Current medicines"],
    outcomes: ["Procedure clarity", "Comfort plan", "After-care instructions"],
  },
  "robotic-gynaecologic-surgery": {
    title: "Plan your robotic surgery discussion",
    intro: "Understand whether robotic surgery makes sense for your case.",
    steps: [
      {
        label: "Condition",
        question: "What is the surgery for?",
        helper: "Choose the closest condition.",
        options: [
          { label: "Fibroids", note: "Discuss size, number, location and uterus preservation." },
          { label: "Endometriosis", note: "Review complexity, pain and organ involvement." },
          { label: "Hysterectomy", note: "Understand route, recovery and safety considerations." },
          { label: "Ovarian cyst", note: "Clarify ovary preservation and minimally invasive suitability." },
          { label: "Second opinion", note: "Compare robotic, laparoscopic and open approaches." },
        ],
      },
      {
        label: "Compare",
        question: "What do you want to compare?",
        helper: "Focus on the decision, not the machine.",
        options: [
          { label: "Robotic vs laparoscopy", note: "Ask what robotic assistance adds in your case." },
          { label: "Robotic vs open surgery", note: "Discuss incision size, recovery and complexity." },
          { label: "Cost and insurance", note: "Clarify package, admission and cashless questions." },
          { label: "Surgeon control", note: "Understand that the robot does not operate by itself." },
        ],
      },
      {
        label: "Readiness",
        question: "What would help you decide?",
        helper: "Pick the main thing you need.",
        options: [
          { label: "Clear risk explanation", note: "Know benefits, limits and possible complications." },
          { label: "Recovery timeline", note: "Plan work, support at home and follow-up." },
          { label: "Fertility impact", note: "Discuss organ preservation and future pregnancy goals." },
          { label: "Hospital plan", note: "Understand admission, tests and discharge expectations." },
        ],
      },
    ],
    bring: ["Recent imaging", "Diagnosis summary", "Prior surgery notes", "Insurance questions"],
    outcomes: ["Technology-fit decision", "Approach comparison", "Recovery and admission plan"],
  },
};

const defaultPath = treatmentPaths["laparoscopic-surgery"];

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className={styles.progressWrap} aria-label={`${done} of ${total} items complete`}>
      <span className={styles.progressText}>
        {done} of {total} ready
      </span>
      <span className={styles.progressTrack}>
        <span className={styles.progressFill} style={{ width: `${(done / total) * 100}%` }} />
      </span>
    </div>
  );
}

export function ConcernGuide() {
  const [step, setStep] = useState<GuideStep>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [urgency, setUrgency] = useState<Urgency>("routine");
  const [hasReports, setHasReports] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const item = selected === null ? null : concernGuide[selected];
  const answeredCount = item ? item.questions.filter((_, index) => answers[index]).length : 0;
  const canContinue = step === 0 ? selected !== null : step === 1 ? item !== null && answeredCount === item.questions.length : true;
  const urgencyInfo = urgencyCopy[urgency];
  const primaryAnswer = item ? answers[0] : "";
  const secondaryAnswer = item ? answers[1] : "";

  const resetGuide = () => {
    setStep(0);
    setSelected(null);
    setUrgency("routine");
    setHasReports(false);
    setAnswers({});
    setSubmitted(false);
  };

  const goBack = () => {
    if (submitted) {
      setSubmitted(false);
      return;
    }
    setStep((current) => (current > 0 ? ((current - 1) as GuideStep) : current));
  };

  const goNext = () => {
    if (!canContinue) return;
    setStep((current) => (current < 2 ? ((current + 1) as GuideStep) : current));
  };

  const selectConcern = (index: number) => {
    setSelected(index);
    setAnswers({});
    setSubmitted(false);
  };

  const selectAnswer = (questionIndex: number, answer: string) => {
    setAnswers((current) => ({ ...current, [questionIndex]: answer }));
  };

  return (
    <section className={`section ${styles.softSection}`}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className="eyebrow">Find Your Starting Point</span>
          <h2>Not sure which care path fits?</h2>
        </div>

        <div className={styles.guideCompact}>
          <div className={styles.choicePanel}>
            <div className={styles.miniTopline}>
              <span>Step {step + 1} of 3</span>
              <button type="button" onClick={resetGuide}>
                Start over
              </button>
            </div>
            <div className={styles.progressTrack}>
              <span className={styles.progressFill} style={{ width: `${((step + 1) / 3) * 100}%` }} />
            </div>

            {!submitted && step === 0 && (
              <>
                <h3>What brings you here today?</h3>
                <div className={styles.optionList}>
                  {concernGuide.map((concern, index) => (
                    <button
                      type="button"
                      key={concern.label}
                      className={`${styles.optionButton} ${index === selected ? styles.optionActive : ""}`}
                      onClick={() => selectConcern(index)}
                      aria-pressed={index === selected}
                    >
                      <span>{concern.label}</span>
                      <small>{concern.cue}</small>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!submitted && step === 1 && item && (
              <>
                <h3>A few details will help</h3>
                <div className={styles.questionStack}>
                  {item.questions.map((question, questionIndex) => (
                    <div className={styles.stepQuestion} key={question.prompt}>
                      <strong>{question.prompt}</strong>
                      <div className={styles.answerGrid}>
                        {question.options.map((option) => (
                          <button
                            type="button"
                            key={option}
                            className={answers[questionIndex] === option ? styles.answerActive : ""}
                            onClick={() => selectAnswer(questionIndex, option)}
                            aria-pressed={answers[questionIndex] === option}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!submitted && step === 2 && item && (
              <>
                <h3>When do you want help?</h3>
                <div className={styles.inlineControls}>
                  <div className={styles.urgencyGrid}>
                    {(Object.keys(urgencyCopy) as Urgency[]).map((key) => (
                      <button
                        type="button"
                        key={key}
                        className={urgency === key ? styles.urgencyActive : ""}
                        onClick={() => setUrgency(key)}
                        aria-pressed={urgency === key}
                      >
                        <strong>{urgencyCopy[key].label}</strong>
                        <span>{urgencyCopy[key].summary}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`${styles.reportToggle} ${hasReports ? styles.reportToggleActive : ""}`}
                    onClick={() => setHasReports((value) => !value)}
                    aria-pressed={hasReports}
                  >
                    <span className={styles.fakeCheck}>{hasReports && <Check width={14} height={14} />}</span>
                    I have reports or prescriptions
                  </button>
                </div>
              </>
            )}

            {submitted && item && (
              <div className={styles.guideResult}>
                <span className={styles.resultBadge}>Your starting point</span>
                <div className={styles.guideResultIntro}>
                  <h3>{item.label}</h3>
                  <p>{item.fit}</p>
                </div>

                <div className={styles.guideUrgency}>
                  <Clock width={18} height={18} />
                  <span>
                    <strong>{urgencyInfo.label}</strong>
                    {urgencyInfo.summary}
                  </span>
                </div>

                <div className={styles.guideResultGrid}>
                  <div className={styles.guideResultCard}>
                    <Check width={18} height={18} />
                    <strong>What this usually means</strong>
                    <span>{item.reassurance}</span>
                  </div>
                  <div className={styles.guideResultCard}>
                    <Phone width={18} height={18} />
                    <strong>Tell the clinic</strong>
                    <span>{[primaryAnswer, secondaryAnswer].filter(Boolean).join(" · ")}</span>
                  </div>
                  <div className={styles.guideResultCard}>
                    <Check width={18} height={18} />
                    <strong>{hasReports ? "Bring these" : "Helpful to prepare"}</strong>
                    <span>{item.bring.slice(0, hasReports ? 3 : 2).join(", ")}</span>
                  </div>
                </div>

                <div className={styles.guideNextSteps}>
                  <strong>Likely next steps</strong>
                  <div>
                    {item.nextSteps.map((nextStep) => (
                      <span key={nextStep}>{nextStep}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.stepActions}>
              <button type="button" className={styles.backButton} onClick={goBack} disabled={step === 0}>
                Back
              </button>
              {submitted ? (
                <div className={styles.ctaPair}>
                  <a href={contact.appointmentUrl} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                    Book appointment <ArrowRight width={18} height={18} />
                  </a>
                  <a href={`tel:${contact.phonePrimary}`} className="btn btn--outline">
                    Call clinic <Phone width={18} height={18} />
                  </a>
                </div>
              ) : step < 2 ? (
                <button type="button" className="btn btn--primary" onClick={goNext} disabled={!canContinue}>
                  Continue <ArrowRight width={18} height={18} />
                </button>
              ) : (
                <button type="button" className="btn btn--primary" onClick={() => setSubmitted(true)}>
                  Show my care plan <ArrowRight width={18} height={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ConsultationPrepKit() {
  const [active, setActive] = useState(0);
  const [goal, setGoal] = useState(0);
  const [timing, setTiming] = useState(0);
  const [step, setStep] = useState(0);
  const concern = prepConcerns[active];
  const selectedGoal = concern.goals[goal];
  const prepSteps = ["Topic", "Details", "Call note"];
  const timingOptions = ["as soon as possible", "this week", "when convenient"];
  const callLine = `I am calling about ${concern.line}. ${selectedGoal.script} I would like an appointment ${timingOptions[timing]}.`;
  const isFinalStep = step === prepSteps.length - 1;

  const reset = () => {
    setActive(0);
    setGoal(0);
    setTiming(0);
    setStep(0);
  };

  return (
    <section className={`section ${styles.prepSection}`}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className="eyebrow">Before You Call</span>
          <h2>Say the right thing when booking</h2>
        </div>

        <div className={styles.noteBuilder}>
          <div className={styles.prepStepper}>
            <div className={styles.plannerTopline}>
              <span>Step {step + 1} of {prepSteps.length}</span>
              <button type="button" onClick={reset}>Start over</button>
            </div>

            <div className={styles.plannerStepRail} aria-label="Booking script steps">
              {prepSteps.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  className={`${index === step ? styles.plannerRailActive : ""} ${index < step ? styles.plannerRailDone : ""}`}
                  onClick={() => setStep(index)}
                  aria-pressed={index === step}
                >
                  <span>{index + 1}</span>
                  {item}
                </button>
              ))}
            </div>

            {!isFinalStep ? (
              <div className={styles.prepQuestionCard}>
                {step === 0 && (
                  <>
                    <span className={styles.plannerLabel}>Topic</span>
                    <h3>What is this about?</h3>
                    <div className={styles.topicCards}>
                      {prepConcerns.map((item, index) => (
                        <button
                          type="button"
                          key={item.label}
                          className={index === active ? styles.topicActive : ""}
                          onClick={() => {
                            setActive(index);
                            setGoal(0);
                          }}
                          aria-pressed={index === active}
                        >
                          <span className={styles.topicImage}>
                            <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 28vw" />
                          </span>
                          <strong>{item.label}</strong>
                          <small>{item.hint}</small>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <span className={styles.plannerLabel}>Details</span>
                    <h3>What should the call cover?</h3>
                    <div className={styles.noteControls}>
                      <div className={styles.noteGroup}>
                        <span className={styles.plannerLabel}>I want to</span>
                        <div className={styles.goalCards}>
                          {concern.goals.map((item, index) => (
                            <button
                              type="button"
                              key={item.label}
                              className={index === goal ? styles.goalActive : ""}
                              onClick={() => setGoal(index)}
                              aria-pressed={index === goal}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.noteGroup}>
                        <span className={styles.plannerLabel}>Book</span>
                        <div className={styles.timingCards}>
                          {["Soon", "This week", "Flexible"].map((item, index) => (
                            <button
                              type="button"
                              key={item}
                              className={index === timing ? styles.timingActive : ""}
                              onClick={() => setTiming(index)}
                              aria-pressed={index === timing}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.callNote}>
                <span className={styles.resultBadge}>Say this when calling</span>
                <p>{callLine}</p>

                <div className={styles.callAssurance}>
                  <Check width={18} height={18} />
                  <span>This is enough to help the clinic route you. You do not need to explain everything perfectly on the call.</span>
                </div>

                <div className={styles.callNoteMeta}>
                  <span>
                    <Phone width={17} height={17} />
                    <strong>Start with</strong>
                    {concern.label}
                  </span>
                  <span>
                    <Check width={17} height={17} />
                    <strong>Ask</strong>
                    {selectedGoal.questions[0]}
                  </span>
                  <span>
                    <Clock width={17} height={17} />
                    <strong>Bring</strong>
                    {concern.bring.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.plannerActions}>
              <button type="button" className={styles.backButton} onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>
                Back
              </button>
              {!isFinalStep ? (
                <button type="button" className="btn btn--primary" onClick={() => setStep((current) => Math.min(current + 1, prepSteps.length - 1))}>
                  {step === prepSteps.length - 2 ? "Show note" : "Next step"} <ArrowRight width={18} height={18} />
                </button>
              ) : (
                <div className={styles.ctaPair}>
                  <a href={contact.appointmentUrl} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                    Book appointment <ArrowRight width={18} height={18} />
                  </a>
                  <a href={`tel:${contact.phonePrimary}`} className="btn btn--outline">
                    Call clinic <Phone width={18} height={18} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TreatmentJourneyWidget({ slug }: { slug: string }) {
  const path = treatmentPaths[slug] ?? defaultPath;
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const step = path.steps[active];
  const isLast = active === path.steps.length - 1;

  const chooseOption = (label: string) => {
    setAnswers((current) => ({ ...current, [active]: label }));
  };

  const goNext = () => {
    if (!answers[active]) return;
    setActive((current) => Math.min(current + 1, path.steps.length - 1));
  };

  const goBack = () => {
    setActive((current) => Math.max(current - 1, 0));
  };

  const reset = () => {
    setActive(0);
    setAnswers({});
  };

  return (
    <section className={styles.treatmentWidget}>
      <div className={styles.widgetIntro}>
        <span className="eyebrow">Plan This Treatment Visit</span>
        <h2>{path.title}</h2>
        <p>{path.intro}</p>
      </div>

      <div className={styles.treatmentStepper}>
        <div className={styles.treatmentReset}>
          <button type="button" onClick={reset}>Start over</button>
        </div>

        <div className={styles.treatmentStepRail} aria-label="Treatment planner steps">
          {path.steps.map((item, index) => (
            <button
              type="button"
              key={item.label}
              className={`${index === active ? styles.treatmentRailActive : ""} ${answers[index] ? styles.treatmentRailDone : ""}`}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              <span>{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.treatmentQuestionCard}>
          <h3>{step.question}</h3>
          <p>{step.helper}</p>
          <div className={styles.treatmentOptionGrid}>
            {step.options.map((option) => (
              <button
                type="button"
                key={option.label}
                className={answers[active] === option.label ? styles.treatmentOptionActive : ""}
                onClick={() => chooseOption(option.label)}
                aria-pressed={answers[active] === option.label}
              >
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.treatmentActions}>
          <button type="button" className={styles.backButton} onClick={goBack} disabled={active === 0}>
            Back
          </button>
          {!isLast ? (
            <button type="button" className="btn btn--primary" onClick={goNext} disabled={!answers[active]}>
              Next step <ArrowRight width={18} height={18} />
            </button>
          ) : (
            <div className={styles.ctaPair}>
              <a href={contact.appointmentUrl} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                Book appointment <ArrowRight width={18} height={18} />
              </a>
              <a href={`tel:${contact.phonePrimary}`} className="btn btn--outline">
                Call clinic <Phone width={18} height={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PatientVisitPlanner() {
  const visitTypes = [
    {
      label: "Clinic consultation",
      note: "Best for symptoms, reports, second opinion or routine gynaecology guidance.",
      arrive: "Arrive 10 minutes early",
      bring: ["Previous prescriptions", "Recent reports", "Medicine list"],
      timeline: ["Share your main concern", "Review reports with the doctor", "Leave with next steps"],
    },
    {
      label: "Pregnancy follow-up",
      note: "Useful for antenatal visits, scan review, high-risk monitoring and delivery planning.",
      arrive: "Arrive 15 minutes early",
      bring: ["Antenatal file", "Latest ultrasound", "BP or sugar notes"],
      timeline: ["Review mother and baby status", "Update monitoring plan", "Clarify warning signs"],
    },
    {
      label: "Procedure discussion",
      note: "For hysteroscopy, laparoscopy, fibroid care, hospital admission or insurance planning.",
      arrive: "Arrive with reports organised",
      bring: ["Imaging reports", "Insurance query", "Past surgery notes"],
      timeline: ["Confirm diagnosis", "Discuss procedure and recovery", "Plan admission or follow-up"],
    },
  ];
  const locations = [
    {
      label: "Raheja Clinic",
      detail: contact.clinic.address,
      rhythm: "Evening clinic visits work well for consultation and report review.",
    },
    {
      label: "C K Birla Hospital",
      detail: "Punjabi Bagh",
      rhythm: "Hospital visits are better for procedures, delivery planning and coordinated investigations.",
    },
  ];
  const focusAreas = ["Report review", "New symptoms", "Pregnancy planning", "Surgery clarity"];
  const [visitType, setVisitType] = useState(0);
  const [location, setLocation] = useState(0);
  const [focus, setFocus] = useState(0);
  const [step, setStep] = useState(0);
  const selectedVisit = visitTypes[visitType];
  const selectedLocation = locations[location];
  const plannerSteps = ["Visit type", "Location + focus", "Your plan"];
  const isFinalStep = step === plannerSteps.length - 1;

  const goNext = () => {
    setStep((current) => Math.min(current + 1, plannerSteps.length - 1));
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const reset = () => {
    setVisitType(0);
    setLocation(0);
    setFocus(0);
    setStep(0);
  };

  return (
    <section className={`section ${styles.patientPlannerSection}`}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className="eyebrow">Before You Visit</span>
          <h2>Build your visit-day plan</h2>
        </div>

        <div className={styles.visitPlanner}>
          <div className={styles.visitStepper}>
            <div className={styles.plannerTopline}>
              <span>Step {step + 1} of {plannerSteps.length}</span>
              <button type="button" onClick={reset}>Start over</button>
            </div>

            <div className={styles.plannerStepRail} aria-label="Visit planner steps">
              {plannerSteps.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  className={`${index === step ? styles.plannerRailActive : ""} ${index < step ? styles.plannerRailDone : ""}`}
                  onClick={() => setStep(index)}
                  aria-pressed={index === step}
                >
                  <span>{index + 1}</span>
                  {item}
                </button>
              ))}
            </div>

            {!isFinalStep ? (
              <div className={styles.plannerQuestionCard}>
                {step === 0 && (
                  <>
                    <span className={styles.plannerLabel}>Visit type</span>
                    <h3>What kind of visit are you planning?</h3>
                    <div className={styles.plannerCards}>
                      {visitTypes.map((item, index) => (
                        <button
                          type="button"
                          key={item.label}
                          className={index === visitType ? styles.plannerCardActive : ""}
                          onClick={() => setVisitType(index)}
                          aria-pressed={index === visitType}
                        >
                          <strong>{item.label}</strong>
                          <small>{item.note}</small>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <span className={styles.plannerLabel}>Location + focus</span>
                    <h3>Where should we route the visit?</h3>
                    <div className={styles.combinedPlannerGrid}>
                      <div>
                        <span className={styles.fieldLabel}>Location</span>
                        <div className={styles.locationToggle}>
                          {locations.map((item, index) => (
                            <button
                              type="button"
                              key={item.label}
                              className={index === location ? styles.locationActive : ""}
                              onClick={() => setLocation(index)}
                              aria-pressed={index === location}
                            >
                              <strong>{item.label}</strong>
                              <small>{item.detail}</small>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className={styles.fieldLabel}>Focus</span>
                        <div className={styles.focusChips}>
                          {focusAreas.map((item, index) => (
                            <button
                              type="button"
                              key={item}
                              className={index === focus ? styles.focusActive : ""}
                              onClick={() => setFocus(index)}
                              aria-pressed={index === focus}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.visitPlanCard}>
                <span className={styles.resultBadge}>Your plan</span>
                <h3>{selectedVisit.label}</h3>
                <p>{selectedVisit.arrive} at <strong>{selectedLocation.label}</strong>. Keep the visit centred on <strong>{focusAreas[focus].toLowerCase()}</strong>.</p>
                <div className={styles.planDetails}>
                  <div>
                    <strong>Visit type</strong>
                    <span>{selectedVisit.note}</span>
                  </div>
                  <div>
                    <strong>Location fit</strong>
                    <span>{selectedLocation.rhythm}</span>
                  </div>
                  <div>
                    <strong>During the visit</strong>
                    <span>{selectedVisit.timeline.join(", then ")}</span>
                  </div>
                </div>
                <div className={styles.bringStrip}>
                  <strong>Bring:</strong>
                  <div>
                    {selectedVisit.bring.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <a href={`tel:${contact.phonePrimary}`} className={styles.helpStrip}>
                  <Phone width={18} height={18} />
                  <span>
                    <strong>Need help?</strong>
                    Call {contact.phones[0]}
                  </span>
                  <ArrowRight width={17} height={17} />
                </a>
              </div>
            )}

            {!isFinalStep && (
              <div className={styles.plannerActions}>
                <button type="button" className={styles.backButton} onClick={goBack} disabled={step === 0}>
                  Back
                </button>
                <button type="button" className="btn btn--primary" onClick={goNext}>
                  {step === plannerSteps.length - 2 ? "Show plan" : "Next step"} <ArrowRight width={18} height={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
