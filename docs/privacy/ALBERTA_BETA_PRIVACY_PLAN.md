# Alberta beta privacy plan

Status: working implementation plan, not legal advice. Complete the owner fields and obtain an Alberta privacy/legal review before enrolling real patients.

## Governing framework

- The Alberta Health Information Act (HIA) is the primary framework for clinical health information handled by a chiropractor acting as a custodian.
- Alberta PIPA may also apply to personal information that is not health information.
- A Privacy Impact Assessment (PIA) should be submitted to the Office of the Information and Privacy Commissioner before implementing a new or materially changed system that handles individually identifying health information.

Official references:

- [Alberta Health Information Act overview](https://www.alberta.ca/health-information-act)
- [OIPC HIA resources](https://oipc.ab.ca/legislation/hia/)
- [OIPC Privacy Impact Assessment FAQ](https://oipc.ab.ca/resource/privacy-impact-assessments-frequently-asked-questions/)
- [OIPC electronic patient communication guidance](https://oipc.ab.ca/resource/electronic-patient-communication/)
- [OIPC breach notification](https://oipc.ab.ca/breach-notification/)

## Named accountability

- Custodian / clinic legal name: **TO COMPLETE**
- Responsible affiliate / privacy officer: **Spencer Barber (confirm legal role and title)**
- Clinic mailing address: **TO COMPLETE**
- Privacy contact email: **spencerbarberchiro@gmail.com (confirm)**
- Privacy contact phone: **TO COMPLETE**
- PIA submission date and OIPC reference: **TO COMPLETE**

## Beta data map

| Data | Purpose | System | Access | Retention decision |
|---|---|---|---|---|
| Name, email, DOB | Identity, account setup, matching records | PostgreSQL / Railway | Treating practitioner; patient for own record | **TO COMPLETE** |
| Intake answers and SRS | Assessment and recovery planning | PostgreSQL / Railway | Treating practitioner; patient for own record | **TO COMPLETE** |
| Clinical notes and assessments | Care documentation | PostgreSQL / Railway | Practitioner only | **TO COMPLETE** |
| Messages and reflections | Care communication and progress review | PostgreSQL / Railway | Patient and practitioner for the same patient | **TO COMPLETE** |
| Login/session data | Authentication and security | Browser secure cookie; server | Account holder; system | Seven-day patient session; review practitioner session |
| Operational email | Account setup and password reset | Gmail / Resend as configured | Intended recipient; service providers | **TO COMPLETE** |
| Application logs | Reliability and security | Railway/Vercel logs | Authorized operator | Set a short documented period; **TO COMPLETE** |

## Required agreements and evidence

Before real-patient use, inventory every service that can store, transmit, back up, or log health information. For each provider, retain:

- signed Information Manager Agreement where HIA section 66 applies;
- written outside-Alberta storage/use/disclosure agreement where applicable;
- data-processing and subprocessors terms;
- hosting and backup regions;
- encryption, access-control, audit-log, deletion, incident-notification, and return-of-data commitments;
- current list of authorized clinic users and their access level.

Providers to verify: Railway, Vercel, database provider, Resend, Gmail/Google Workspace, source-code/error-monitoring services, and any backup provider.

## Controls implemented in the beta code

- Patient endpoints require a signed session and enforce same-patient access.
- Practitioner clinical endpoints require practitioner authentication.
- Patient and practitioner passwords are hashed and minimum password rules are enforced.
- Login and intake endpoints are rate limited.
- Production CORS uses exact approved origins.
- Sensitive responses use `Cache-Control: no-store` and standard security headers.
- Intake and identity data are no longer persisted in browser local storage or placed in the account-setup URL.
- Patient password hashes are excluded from patient API queries.
- Welcome emails do not state a recovery phase, score, or assessment details.
- Logs were reduced to avoid names, email addresses, patient IDs, scores, message subjects, and assessment bodies.

## Open items before real-patient beta

1. Complete and submit the PIA; retain the submitted version and all follow-up correspondence.
2. Confirm custodian identity, privacy officer, contact information, and the final privacy notice.
3. Sign and archive all required Information Manager / outside-Alberta agreements.
4. Set written retention periods for clinical records, messages, audit data, application logs, and backups.
5. Verify encrypted backups and perform a documented restore test.
6. Implement a durable security audit trail for practitioner access and changes to clinical records.
7. Move practitioner authentication from browser local storage to a secure HTTP-only cookie.
8. Make patient setup links one-time use and document revocation/reissue handling.
9. Add and test an in-product privacy-notice acknowledgement after the notice is approved.
10. Run an access/export/correction/deletion procedure using a beta record.
11. Complete the incident-response tabletop exercise in `INCIDENT_RESPONSE.md`.

## Release gate

Do not mark the system ready for real patient information until items 1-5 are complete and documented. Items 6-11 should be completed before expanding beyond a tightly controlled beta.
