"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type Profile = Record<string, string>;

const initialProfile: Profile = {
  fullName: "", gender: "Male", dateOfBirth: "", birthTime: "", birthPlace: "",
  religion: "Hindu", caste: "", subCaste: "", star: "", rasi: "", dosham: "",
  education: "", occupation: "", workplace: "", monthlyIncome: "", height: "",
  weight: "", complexion: "", fatherName: "", motherName: "", siblings: "",
  familyDetails: "", propertyDetails: "", partnerExpectation: "", mobile: "",
  email: "", address: "", city: "", district: "", pincode: "",
};

const sections = [
  { title: "Basic details", note: "Tell us about the person creating this profile.", fields: [["fullName","Full name","text"],["gender","Gender","select"],["dateOfBirth","Date of birth","date"],["height","Height","text"],["weight","Weight","text"],["complexion","Complexion","text"]] },
  { title: "Birth & horoscope", note: "Traditional details from the reference form.", fields: [["birthTime","Birth time","time"],["birthPlace","Birth place","text"],["religion","Religion","select"],["caste","Caste / Community","text"],["subCaste","Sub-caste","text"],["star","Star / Nakshatra","text"],["rasi","Rasi","text"],["dosham","Dosham, if any","text"]] },
  { title: "Education & career", note: "Professional information shown in the shared profile.", fields: [["education","Highest education","text"],["occupation","Occupation","text"],["workplace","Company / Workplace","text"],["monthlyIncome","Monthly income","text"]] },
  { title: "Family details", note: "A short, respectful introduction to the family.", fields: [["fatherName","Father’s name","text"],["motherName","Mother’s name","text"],["siblings","Brothers / Sisters","text"],["familyDetails","Family details","textarea"],["propertyDetails","Property details (optional)","textarea"],["partnerExpectation","Partner expectations","textarea"]] },
  { title: "Private contact details", note: "These details are stored privately and never appear on the shared profile PDF.", private: true, fields: [["mobile","Mobile number","tel"],["email","Email address","email"],["address","Full home address","textarea"],["city","City / Town","text"],["district","District","text"],["pincode","PIN code","text"]] },
];

function Field({ item, value, onChange }: { item: string[]; value: string; onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  const [name, label, type] = item;
  if (type === "textarea") return <label className="form-field wide"><span>{label}</span><textarea name={name} value={value} onChange={onChange} rows={3} /></label>;
  if (type === "select") {
    const choices = name === "gender" ? ["Male", "Female", "Other"] : ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Other"];
    return <label className="form-field"><span>{label}</span><select name={name} value={value} onChange={onChange}>{choices.map(choice => <option key={choice}>{choice}</option>)}</select></label>;
  }
  return <label className="form-field"><span>{label}</span><input name={name} type={type} value={value} onChange={onChange} required={["fullName","dateOfBirth","mobile"].includes(name)} /></label>;
}

export default function RegisterPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState("");
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [consent, setConsent] = useState(false);
  const registrationId = useMemo(() => `MM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, []);

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setProfile(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function loadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (step < sections.length - 1) return setStep(step + 1);
    if (!consent) return;
    setPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openWhatsApp() {
    const message = `Vanakkam, please find the matrimony profile of ${profile.fullName || "our registered member"} (${registrationId}). The attached profile has been prepared with private contact details removed.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function openEmail() {
    const subject = `Matrimony Profile – ${profile.fullName || registrationId}`;
    const body = `Hello,\n\nPlease find the matrimony profile of ${profile.fullName || "our registered member"} (${registrationId}). Private address and contact information are not included.\n\nPlease attach the downloaded profile PDF before sending.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  if (preview) return (
    <main className="profile-preview-page">
      <header className="form-topbar no-print"><a className="brand" href="/"><span className="brand-mark">M</span><span>MilanMitra</span></a><span className="secure-note">✓ Privacy-safe sharing</span></header>
      <div className="preview-actions no-print"><button className="ghost-button" onClick={() => setPreview(false)}>← Edit profile</button><div><button className="ghost-button" onClick={openWhatsApp}>Share message on WhatsApp</button><button className="ghost-button" onClick={openEmail}>Prepare email</button><button className="button" onClick={() => window.print()}>Download / Print PDF</button></div></div>
      <p className="share-help no-print">First save the PDF, then attach it to the prepared WhatsApp message or email.</p>
      <article className="biodata-sheet">
        <div className="sheet-header"><div><span className="sheet-kicker">MATRIMONY PROFILE</span><h1>{profile.fullName || "Member profile"}</h1><p>{registrationId} · Created {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div><div className="sheet-logo">M</div></div>
        <div className="sheet-intro"><div className="sheet-photo">{photo ? <img src={photo} alt={profile.fullName} /> : <span>{(profile.fullName || "M").charAt(0)}</span>}</div><div><h2>{profile.fullName || "Name not entered"}</h2><p>{[profile.occupation, profile.education, profile.city].filter(Boolean).join(" · ") || "Profile details"}</p><span className="verified-pill">✓ Registered profile</span></div></div>
        <SheetSection title="Personal details" data={[["Gender",profile.gender],["Date of birth",profile.dateOfBirth],["Height",profile.height],["Weight",profile.weight],["Complexion",profile.complexion],["Birth place",profile.birthPlace]]} />
        <SheetSection title="Horoscope details" data={[["Religion",profile.religion],["Community",profile.caste],["Sub-caste",profile.subCaste],["Star",profile.star],["Rasi",profile.rasi],["Dosham",profile.dosham]]} />
        <SheetSection title="Education & career" data={[["Education",profile.education],["Occupation",profile.occupation],["Workplace",profile.workplace],["Monthly income",profile.monthlyIncome]]} />
        <SheetSection title="Family" data={[["Father",profile.fatherName],["Mother",profile.motherName],["Siblings",profile.siblings],["Family details",profile.familyDetails],["Property details",profile.propertyDetails]]} />
        <SheetSection title="Partner expectations" data={[["Looking for",profile.partnerExpectation]]} />
        <div className="privacy-banner"><strong>Privacy protected</strong><span>Home address, phone number, email and other private contact details are intentionally omitted from this shared profile.</span></div>
        <footer className="sheet-footer"><strong>MilanMitra</strong><span>Thoughtful connections. Beautiful beginnings.</span><span>{registrationId}</span></footer>
      </article>
    </main>
  );

  const section = sections[step];
  return (
    <main className="registration-page">
      <header className="form-topbar"><a className="brand" href="/"><span className="brand-mark">M</span><span>MilanMitra</span></a><a className="back-home" href="/">← Back to website</a></header>
      <section className="registration-shell">
        <aside className="registration-aside"><span className="kicker">CREATE A PROFILE</span><h1>A beautiful beginning starts with the right details.</h1><p>Complete the form once. We&apos;ll turn it into a clean, shareable matrimony profile while keeping the address private.</p><div className="privacy-promise"><span>⌾</span><div><strong>Private by design</strong><p>Contact details stay hidden from the PDF and sharing view.</p></div></div><div className="form-progress">{sections.map((item,index) => <button key={item.title} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>{index < step ? "✓" : index + 1}</span>{item.title}</button>)}</div></aside>
        <form className="registration-form" onSubmit={submit}>
          <div className="form-heading"><span>Step {step + 1} of {sections.length}</span><h2>{section.title}</h2><p>{section.note}</p></div>
          {step === 0 && <label className="photo-upload"><input type="file" accept="image/*" onChange={loadPhoto} /><span className="upload-photo">{photo ? <img src={photo} alt="Profile preview" /> : "+"}</span><div><strong>{photo ? "Change profile photo" : "Add profile photo"}</strong><small>JPG or PNG · Clear front-facing photo recommended</small></div></label>}
          {section.private && <div className="private-banner"><span>🔒</span><p><strong>Private information</strong><br />This section is for office records only. It will not be included in the shared profile or PDF.</p></div>}
          <div className="form-grid">{section.fields.map(item => <Field key={item[0]} item={item} value={profile[item[0]]} onChange={update} />)}</div>
          {step === sections.length - 1 && <label className="consent-check"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I confirm these details are correct and consent to creating a matrimony profile. Private details must not be included when the profile is shared.</span></label>}
          <div className="form-controls">{step > 0 && <button type="button" className="ghost-button" onClick={() => setStep(step - 1)}>← Previous</button>}<button className="button" type="submit" disabled={step === sections.length - 1 && !consent}>{step === sections.length - 1 ? "Create profile preview" : "Save & continue"} →</button></div>
        </form>
      </section>
    </main>
  );
}

function SheetSection({ title, data }: { title: string; data: string[][] }) {
  const visible = data.filter(item => item[1]);
  if (!visible.length) return null;
  return <section className="sheet-section"><h3>{title}</h3><div className="sheet-data">{visible.map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>;
}
