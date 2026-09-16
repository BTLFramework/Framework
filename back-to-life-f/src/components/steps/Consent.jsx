import React from "react";

export const CURRENT_PATIENT_CONSENT_VERSION = "2026-09-beta-v1";

export default function Consent({ formData, onChange }) {
  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Consent and Privacy</h2>
        <p className="btl-section-subtitle">
          Please review how your information will be used before submitting your assessment.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 text-sm text-slate-700">
          <h3 className="mb-3 text-base font-semibold text-slate-900">How we use your information</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Calculate your Signature Recovery Score and personalize your recovery program.</li>
            <li>Support assessment, care planning, progress tracking, and communication with your authorized practitioner.</li>
            <li>Operate the secure patient and practitioner portals and maintain appropriate clinical and administrative records.</li>
            <li>Send account, care, and appointment-related messages. Your information is not sold or used for advertising.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Your choices</h3>
          <p className="mb-3">
            You may ask to access or correct your information, ask how it has been handled, or tell us your wishes about disclosure. You may withdraw this consent for future use or communication, although doing so may limit use of the digital program. Withdrawal does not affect handling that was already authorized, and some records may still need to be retained for clinical, legal, or safety reasons.
          </p>
          <p className="mb-3">
            Information may be used or disclosed without consent only where permitted or required by law. This acknowledgement takes effect when you submit it and remains in effect until it is replaced or withdrawn.
          </p>
          <p>
            Questions or privacy requests can be sent to{" "}
            <a className="font-medium text-cyan-700 underline" href="mailto:spencerbarberchiro@gmail.com">
              spencerbarberchiro@gmail.com
            </a>.
          </p>
        </div>

        <label className={`block cursor-pointer rounded-xl border p-5 transition-colors ${
          formData.healthInformationConsentAccepted ? "border-cyan-500 bg-cyan-50" : "border-slate-300 bg-white"
        }`}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="healthInformationConsentAccepted"
              checked={formData.healthInformationConsentAccepted === true}
              onChange={onChange}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-cyan-700"
            />
            <span className="text-sm leading-6 text-slate-800">
              I consent to the collection, use, and secure storage of the personal and health information I provide for assessment, care planning, progress tracking, and operation of the Back to Life patient and practitioner portals. <strong>Required</strong>
            </span>
          </div>
        </label>

        <label className={`block cursor-pointer rounded-xl border p-5 transition-colors ${
          formData.electronicCommunicationsAccepted ? "border-cyan-500 bg-cyan-50" : "border-slate-300 bg-white"
        }`}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="electronicCommunicationsAccepted"
              checked={formData.electronicCommunicationsAccepted === true}
              onChange={onChange}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-cyan-700"
            />
            <span className="text-sm leading-6 text-slate-800">
              I consent to receiving account, care, and appointment-related email and portal messages. I understand ordinary email may carry privacy risks and I can change this preference by contacting the clinic. <strong>Required</strong>
            </span>
          </div>
        </label>

        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          This privacy acknowledgement is separate from consent to examination or treatment. The assessment supports care but does not replace professional medical advice or emergency services. If you may be experiencing an emergency, call 911 or seek urgent medical care.
        </p>
      </div>
    </section>
  );
}
