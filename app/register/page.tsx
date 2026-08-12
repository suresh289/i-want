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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedRegistrationId, setSavedRegistrationId] = useState("");
  const temporaryRegistrationId = useMemo(() => `MM-${new Date().getFullYear()}-DRAFT`, []);
  const registrationId = savedRegistrationId || temporaryRegistrationId;

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setProfile(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function loadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step < sections.length - 1) return setStep(step + 1);
    if (!consent) return;
    setSaving(true); setSaveError("");
    try {
      const form = new FormData();
      form.set("profile", JSON.stringify(profile));
      if (photoFile) form.set("photo", photoFile);
      const response = await fetch("/api/profiles", { method: "POST", body: form });
      const data = await response.json() as { registrationId?: string; error?: string };
      if (!response.ok || !data.registrationId) throw new Error(data.error || "Unable to save the registration.");
      setSavedRegistrationId(data.registrationId); setPreview(true); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save the registration.");
    } finally { setSaving(false); }
  }

  function openConfirmationEmail() {
    const subject = `Registration confirmed – ${registrationId}`;
    const body = `Dear ${profile.fullName},\n\nYour matrimony profile has been registered successfully.\n\nRegistration number: ${registrationId}\nStatus: Awaiting admin review\n\nWe will contact you after verification. Your address and private contact details will never be included in a shared profile without consent.\n\nRegards,\nMilanMitra`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  if (preview) return <main className="registration-success"><header className="form-topbar"><a className="brand" href="/"><span className="brand-mark">M</span><span>MilanMitra</span></a></header><section><div className="success-check">✓</div><span className="kicker">REGISTRATION COMPLETE</span><h1>Thank you, {profile.fullName}.</h1><p>Your profile has been saved and is waiting for admin verification.</p><div className="registration-ticket"><span>Registration number</span><strong>{registrationId}</strong><small>Please save this number for future reference.</small></div><div className="success-privacy">🔒 Your address and private contact information are securely stored and will not appear in shared profiles.</div>{profile.email&&<button className="button" onClick={openConfirmationEmail}>Prepare confirmation email →</button>}<a className="ghost-button" href="/">Return to website</a></section></main>;

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
          {saveError && <p className="form-error" role="alert">{saveError}</p>}
          <div className="form-controls">{step > 0 && <button type="button" className="ghost-button" onClick={() => setStep(step - 1)} disabled={saving}>← Previous</button>}<button className="button" type="submit" disabled={saving || (step === sections.length - 1 && !consent)}>{saving ? "Saving securely…" : step === sections.length - 1 ? "Save & create profile" : "Save & continue"} →</button></div>
        </form>
      </section>
    </main>
  );
}
