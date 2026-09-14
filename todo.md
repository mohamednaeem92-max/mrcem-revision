# OCR Review Enhancement Checklist

- [x] Inspect the current OCR extractor, review-notes format, and browser import validation.
- [x] Define a review-ready record format with clear validation states and source-image links.
- [x] Add an extraction command that produces reviewable bundles and concise quality reports.
- [x] Add validation and conversion commands that generate app-importable JSON only after review.
- [x] Test the pipeline with the existing EBM pilot PDF and document the workflow.

## Anatomy Drive Delivery

- [x] Restore or regenerate the complete Anatomy OCR review bundle for delivery.
- [x] Package the Anatomy review bundle with a manifest and checksum.
- [x] Upload the packaged Anatomy review bundle to the user's Google Drive.
- [x] Verify the uploaded Drive file and provide the review handoff link.

## Recursive MRCEM Markdown Dataset

- [x] Build a recursive Drive inventory and identify duplicate or overlapping source files.
- [x] Create a resumable OCR, source-image, and Markdown extraction pipeline.
- [x] Process every supported canonical PDF and nested-folder source file.
- [x] Validate Markdown front matter, asset links, source counts, and duplicate records.
- [x] Package subject datasets and the master manifest for private Drive delivery.

## Markdown Question Sections

- [x] Inspect the uploaded Markdown archive, record counts, and subject/topic metadata.
- [x] Define canonical revision sections and conversion eligibility rules.
- [x] Generate per-section question JSON and a complete import manifest.
- [x] Integrate the sectioned bank into the offline revision app.
- [x] Validate section totals, question fields, and app import behaviour.

## Approved Question Spaced Repetition

- [x] Inspect current attempt, progress, backup, and approved-question storage contracts.
- [x] Define local review-state fields, scheduling intervals, and answer-quality rules.
- [x] Add adaptive scheduling, due queues, daily review metrics, and reset-safe backup support.
- [x] Test the scheduling sequence, review launch controls, and offline persistence.

## High-Yield Notes and Mnemonics

- [x] Inspect current question fields, import validation, and post-answer explanation layout.
- [x] Define source-aware high-yield note and mnemonic rules for approved records.
- [x] Add import fields and post-answer learning-aid panels.
- [x] Test local import compatibility and the revised feedback sequence.

## Learning-Aid Visibility

- [x] Inspect the current high-yield and mnemonic feedback panels.
- [x] Add a local persistent show/hide toggle for learning aids.
- [x] Test toggle behaviour during approved and OCR-draft review sessions.

## Exam-Style Learning-Aid Default

- [x] Inspect the existing local settings and learning-aid preference contract.
- [x] Add a global setting that defaults learning aids to hidden in new review sessions.
- [x] Test setting persistence, session reset behaviour, and manual aid reveal controls.

## MRCEM Primary Mock Exams

- [x] Verify the current official MRCEM Primary written-assessment format and constraints.
- [x] Define Primary mock-exam generation rules using approved questions only.
- [x] Add Primary mock setup, timed delivery, answer locking, and a post-exam review summary.
- [x] Test deterministic generation, timing controls, local persistence, and completed-exam feedback.

## MRCEM Primary Basic Sciences Blueprint

- [x] Verify the official Basic Sciences curriculum categories and published blueprint constraints.
- [x] Add source-reviewed blueprint tags to approved questions and import validation.
- [x] Balance mock selection against available blueprint-tagged coverage without repeats.
- [x] Test balanced distribution, fallback behaviour, and coverage reporting.

## Post-Answer Emoji Mnemonics

- [x] Inspect current approved-question explanations and mnemonic panel behaviour.
- [x] Add concise authored emoji memory cues to verified question mnemonics.
- [x] Test explanations, learning-aid visibility, and OCR-draft safeguards after answering.

## Incorrect-Answer Review

- [x] Inspect existing missed filters and practice session routing.
- [x] Add a focused incorrect-answer review entry point and session state.
- [x] Test filtering, empty state, answer feedback, and local progress updates.

## Source-Linked Question and Learning-Aid Audit

- [x] Inventory all approved and OCR-draft question records with their source links and evidence status.
- [x] Define source hierarchy, answer-key correction criteria, and non-hallucination rules.
- [x] Audit option ordering and answer-key consistency across every record.
- [x] Research missing high-yield notes and mnemonics only where authoritative sources support them.
- [x] Apply source-supported corrections and retain unresolved records for manual review.
- [x] Validate audit logs, answer-key changes, and updated local import compatibility.

## Anatomy Source-Verified Batch 01

- [x] Define the initial contiguous Anatomy source-page batch and source-evidence gate.
- [x] Retrieve and inspect original pages for question text, options, and answer markers.
- [x] Validate eligible Anatomy records and retain unresolved OCR drafts.
- [x] Add source-supported high-yield notes and mnemonics only to confirmed records.
- [x] Apply validated updates, test app integrity, and document batch results.

## Reviewed-Import Blueprint Metadata

- [x] Inspect the OCR review record, reviewed-bank import, and mock-eligibility contracts.
- [x] Add editable Primary blueprint category and subcategory fields to review records.
- [x] Validate and preserve blueprint metadata in generated approved-question JSON.
- [x] Test valid and invalid blueprint metadata against mock-exam eligibility.
- [x] Document the updated pre-import command sequence.

## Clinical Record Visual Refinement

- [x] Recast dashboard metrics as compact clinical record strips.
- [x] Use the Meridian compass as a consistent active-study and provenance seal.
- [x] Continue chart-paper and source-trace details through the subject-folder records.

## High-Yield Recall and Mnemonic Aids

- [x] Define backward-compatible structured memory-aid fields and validation safeguards.
- [x] Add post-answer cue-only and deliberate-reveal learning-aid controls.
- [x] Add a local high-yield recall session with independent recall ratings.
- [x] Add local cue-visibility and recall-session preferences with backup migration.
- [x] Extend the audit and dashboard to show eligible learning-aid coverage.
- [x] Test accessibility, eligibility filters, persistence, and mock-exam safeguards.

## Full OCR Verification and Evidence Audit

- [x] Regenerate the full-bank inventory and deterministic source-page batch queue.
- [ ] Verify source-page transcription, options, answer markers, and visual dependencies batch by batch.
- [ ] Triage language, terminology, and medical-content issues behind evidence gates.
- [ ] Apply only guarded source- and evidence-supported corrections.
- [x] Regenerate full-bank coverage reports and validate all learning and mock safeguards.

## Continuing Source-Review Programme

- [ ] Process each queued batch sequentially using the original source page, authoritative external evidence, fail-closed drift guards, and deterministic verification.
- [ ] Retain unresolved or contradictory records as `needs_review`, exclude them from answer learning, and advance the queue only after the source-page warning is recorded.
- [ ] Checkpoint each completed batch with regenerated inventory, source-queue, learning-aid coverage, test, and build results.

## Anatomy Batch 03: Pages 93-134

- [x] Export the current Batch 03 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and publish the batch result.

## Anatomy Batch 04: Pages 137-172

- [x] Export the current Batch 04 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and publish the batch result.

## Anatomy Batch 05: Pages 175-212

- [x] Export the current Batch 05 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 06.

## Anatomy Batch 06: Pages 217-259

- [x] Export the current Batch 06 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 07.

## Anatomy Batch 07: Pages 262-296

- [x] Export the current Batch 07 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 08.

## Anatomy Batch 08: Pages 299-334

- [x] Export the current Batch 08 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 09.

## Anatomy Batch 09: Pages 337-374

- [x] Export the current Batch 09 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 10.

## Anatomy Batch 10

- [x] Export the current Batch 10 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 11.

## Anatomy Batch 11: Pages 412-438

- [x] Export the current Batch 11 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 12.

## Anatomy Batch 12: Pages 442-481

- [x] Export the current Batch 12 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 13.

## Anatomy Batch 13: Pages 484-512

- [x] Export the current Batch 13 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 14.

## Anatomy Batch 14: Pages 513-533

- [x] Export the current Batch 14 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 15.

## Anatomy Batch 15: Pages 537-555

- [x] Export the current Batch 15 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 16.

## Anatomy Batch 16: Pages 556-573

- [x] Export the current Batch 16 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, and checkpoint progress before starting Batch 17.

## Clinical Record Hierarchy Refinement

- [x] Reserve Meridian Teal and the compass seal for active, verified, and primary-study states.
- [x] Strengthen the Meridian mark and wordmark as a clinical navigation and provenance device.
- [x] Reinforce subject folders as ruled clinical records with distinct source and performance zones.
- [x] Increase the visual separation of operational interface data and editorial learning content.
- [x] Rework the reference column as a pinned, authoritative clinical sheet.

## Anatomy Batch 17: Pages 574-586

- [x] Export the current Batch 17 OCR records, confirm deterministic source pages, and inspect each original source page.
- [x] Collect authoritative evidence for each source-confirmed candidate correction and retain conflicting exact formulations as restricted records.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 18 source queue.

## Anatomy Batch 18: Pages 593-611

- [x] Export the current Batch 18 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction and retain two records with non-unique evidence as restricted drafts.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 19 source queue.

## Anatomy Batch 19: Pages 614-623

- [x] Export the current Batch 19 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for every source-confirmed candidate correction.
- [x] Apply ten guarded restorations without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 20 source queue.

## Anatomy Batch 20: Pages 624-633

- [x] Export the current Batch 20 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction and retain three records with insufficiently exact evidence as restricted drafts.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 21 source queue.

## Anatomy Batch 21: Pages 634-649

- [x] Export the current Batch 21 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction and retain three records with unsupported exact formulations as restricted drafts.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 22 source queue.

## Anatomy Batch 22: Pages 650-663

- [x] Export the current Batch 22 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for every source-confirmed candidate correction.
- [x] Apply ten guarded restorations without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 23 source queue.

## Anatomy Batch 23: Pages 666-675

- [x] Export the immutable Batch 23 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the fixed aortic-bifurcation surface landmark because the exact formulation is not sufficiently corroborated.
- [x] Apply nine guarded restorations and one source-inspected restriction without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 24 source queue (pages 676-689).

## Anatomy Batch 24: Pages 676-689

- [x] Export the immutable Batch 24 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the conflicting IVC-duodenum key, the wording-sensitive rectus-sheath record, and the unmarked ureter record.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 25 source queue (pages 692-737).

## Anatomy Batch 25: Pages 692-737

- [x] Export the immutable Batch 25 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict two unmarked records and three records where the exact source formulation was not sufficiently corroborated.
- [x] Apply five guarded restorations and five source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 26 source queue (pages 741-782).

## Anatomy Batch 26: Pages 741-782

- [x] Export the immutable Batch 26 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the non-unique portal-triad item, the insufficiently corroborated renal-disc landmark, and the exact inguinal-floor wording.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 27 source queue (pages 787-823).

## Anatomy Batch 27: Pages 787-823

- [x] Export the immutable Batch 27 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the modern zone-versus-posterior-lobe formulation and the conflicting deep-inguinal-ring landmark.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 28 source queue (pages 826-862).

## Anatomy Batch 28: Pages 826-862

- [x] Export the immutable Batch 28 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the combined third-and-fourth-duodenal formulation and the isolated ilioinguinal-motor formulation.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 29 source queue (pages 866-904).

## Anatomy Batch 29: Pages 866-904

- [x] Export the immutable Batch 29 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the whole-pancreas “primarily splenic artery” formulation because current evidence confirms multi-vessel supply rather than that exact claim.
- [x] Apply nine guarded restorations and one source-inspected restriction without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 30 source queue (pages 909-949).

## Anatomy Batch 30: Pages 909-949

- [x] Export the immutable Batch 30 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the fixed aortic landmark, exact ureter-psoas wording, non-unique bladder-afferent formulation, and exact internal-oblique insertion formulation.
- [x] Apply six guarded restorations and four source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify safeguards, regenerate audit coverage, validate import metadata, typecheck, test, build, and confirm the Batch 31 source queue (pages 952-985).

## Anatomy Batch 31: Pages 952-985

- [x] Export the immutable Batch 31 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each source-confirmed candidate correction; restrict the ilioinguinal root-variation record, the insufficiently corroborated transverse-colon relation set, and the non-unique supine-fluid formulation.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 31, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 32 source queue (pages 990-1028).

## Anatomy Batch 32: Pages 990-1028

- [x] Export the immutable Batch 32 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for every displayed source-page key, retaining a terminology caveat for the historical “urogenital diaphragm” wording.
- [x] Apply ten guarded restorations without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 32, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 33 source queue (pages 1033-1063).

## Anatomy Batch 33: Pages 1033-1063

- [x] Export the immutable Batch 33 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the exact ureteric-origin level and psoas-major root-range records because current sources conflict with or do not stably support their displayed formulations.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 33, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 34 source queue (pages 1067-1100).

## Anatomy Batch 34: Pages 1067-1100

- [x] Export the immutable Batch 34 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the generic rectal visceral-afferent formulation because the stem does not localize a unique splanchnic pathway.
- [x] Apply nine guarded restorations and one source-inspected restriction without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 34, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 35 source queue (pages 1105-1129).

## Anatomy Batch 35: Pages 1105-1129

- [x] Export the immutable Batch 35 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the absolute rectus-sheath, unqualified iliohypogastric-root, and singular pancreatic-body-level formulations because current evidence records anatomic variation or conflicting topography.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 35, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 36 source queue (pages 1134-1172).

## Anatomy Batch 36: Pages 1134-1172

- [x] Export the immutable Batch 36 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for every displayed source-page key.
- [x] Apply ten guarded restorations without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 36, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 37 source queue (pages 1176-1197).

## Anatomy Batch 37: Pages 1176-1197

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, and displayed keys for pages 1176, 1180, 1181, 1183, 1188, 1189, 1194, 1195, 1196, and 1197.
- [x] Export the immutable Batch 37 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the exact stomach-region, lower-colon visceral-afferent, and rectovesical-fascia formulations because current evidence is insufficiently specific or establishes non-unique pathways.
- [x] Apply seven guarded restorations and three source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 37, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 38 source queue (pages 1201-1224).

## Anatomy Batch 38: Pages 1201-1224

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, and displayed keys for pages 1201, 1202, 1203, 1205, 1209, 1212, 1213, 1216, 1220, and 1224.
- [x] Export the immutable Batch 38 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the BPH historic-lobe and exact flaccid-urethral-curvature formulations because current evidence is insufficiently specific.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 38, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 39 source queue (pages 1229-1240).

## Anatomy Batch 39: Pages 1229-1240

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, and displayed keys for pages 1229, 1230, 1233, 1234, 1235, 1236, 1237, 1238, 1239, and 1240.
- [x] Export the immutable Batch 39 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the exact ureteric-pain dermatomal range and ureterovesical pubic-tubercle landmark because current evidence conflicts with or does not support their precise formulations.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 39, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 40 source queue (pages 1241-1258).

## Anatomy Batch 40: Pages 1241-1258

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, and displayed keys for pages 1241, 1244, 1246, 1249, 1250, 1254, 1255, 1256, 1257, and 1258.
- [x] Export the immutable Batch 40 OCR records, render the deterministic source pages, and inspect all ten original source pages.
- [x] Collect authoritative evidence for each displayed source-page key; restrict the exact quadratus-lumborum innervation and pancreatic visceral-afferent ranges because current evidence does not uniquely corroborate their formulations.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 40, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 41 source queue (pages 1262-1279).

## Anatomy Batch 41: Pages 1262-1279

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and the image dependency on pages 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1276, and 1279.
- [x] Reconstruct the Batch 41 source registry and external-evidence notes after recovery, preserving the immutable snapshot as the mutation guard baseline.
- [x] Apply eight guarded restorations and two source-inspected restrictions without creating approved or mock-eligible records.
- [x] Verify all batch safeguards through Batch 41, regenerate inventory, source-queue, and learning-aid audits, validate import metadata, typecheck, test, build, and confirm the Batch 42 source queue (pages 1283-1298).

## Anatomy Batch 42: Pages 1283-1298

- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1283, 1284, 1286, 1287, 1288, 1289, 1293, 1294, 1297, and 1298.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 42 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 42 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 43: Pages 1299-1308
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1299-1308.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 43 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 43 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 44: Pages 1309-1321
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1309-1317 and 1321.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 44 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 44 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.
- [x] Fix the ten Batch 44 learning-aid objects missing the required `sourceLabel` field, then rerun typecheck, tests, and build.

## Anatomy Batch 45: Pages 1322-1334
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1322-1324, 1326-1327, and 1330-1334.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 45 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 45 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 46: Pages 1335-1350
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1335-1339, 1342-1343, and 1346, 1349-1350.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 46 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 46 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 47: Pages 1351-1360
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1351-1360.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 47 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 47 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 48: Pages 1361-1465
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1361-1366, 1450, 1456, 1459, and 1465.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 48 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 48 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 49: Pages 1468-1521
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1468, 1471, 1476, 1482, 1488, 1491, 1497, 1505, 1510, and 1521.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 49 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 49 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 50: Pages 1522-1542
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1522, 1528-1532, 1536-1538, and 1542.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 50 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 50 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 51: Pages 1543-1556
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1543-1545 and 1550-1556.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 51 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 51 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 52: Pages 1557-1568
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1557-1558 and 1561-1568.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 52 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 52 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.
- [x] Create the missing Batch 52 guarded mutation and verifier scripts from the validated prior-batch template, then rerun the guarded mutation and full validation.

## Anatomy Batch 53: Pages 1572-1583
- [x] Export immutable records, render direct source pages, and inspect literal stems, option order, displayed keys, and any image dependency on pages 1572-1576 and 1579-1583.
- [x] Record literal source transcriptions and displayed keys in the deterministic Batch 53 source ledger.
- [x] Collect authoritative NCBI/PMC corroboration and document conservative caveats for all ten records.
- [x] Apply guarded source-faithful restorations with immutable drift checks and no automatic approval.
- [x] Verify Batch 53 safeguards, regenerate audit reports, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 54: Pages 1584-1595
- [x] Export the current Batch 54 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 55: Pages 1596-1605
- [x] Export the current Batch 55 OCR records and inspect all ten original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 56: Next queued source pages
- [x] Export the current Batch 56 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 57: Next queued source pages
- [x] Export the current Batch 57 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 58: Next queued source pages
- [x] Export the current Batch 58 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 59: Next queued source pages
- [x] Export the current Batch 59 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 60: Next queued source pages
- [x] Export the current Batch 60 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 61: Next queued source pages
- [x] Export the current Batch 61 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 62: Next queued source pages
- [x] Export the current Batch 62 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 63: Next queued source pages
- [x] Export the current Batch 63 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 64: Next queued source pages
- [x] Export the current Batch 64 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 65: Next queued source pages
- [x] Export the current Batch 65 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 66: Pages 1856-1875
- [x] Export the current Batch 66 OCR records and inspect all original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative evidence for each source-confirmed candidate correction.
- [x] Apply guarded restorations and restrict any medically unresolved records.
- [x] Verify safeguards, regenerate audit coverage, run typecheck/tests/build, and checkpoint the completed batch.

## Anatomy Batch 67: Pages 1876-1887

- [x] Export the immutable Batch 67 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain all ten records as unapproved OCR drafts.
- [x] Verify all 67 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, 10 Vitest tests, and the production build.
- [x] Checkpoint the completed Batch 67 audit state.

## Anatomy Batch 68: Pages 1888-1900

- [x] Export the immutable Batch 68 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 68 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [ ] Checkpoint the completed Batch 68 audit state.

## Anatomy Batch 69: Pages 1903-1912

- [x] Export the immutable Batch 69 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 69 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [ ] Checkpoint the completed Batch 69 audit state.

## Anatomy Batch 70: Pages 1915-1924

- [x] Export the immutable Batch 70 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 70 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [ ] Checkpoint the completed Batch 70 audit state.

## Anatomy Batch 71: Pages 1925-1945

- [x] Export the immutable Batch 71 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 71 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [x] Checkpoint the completed Batch 71 audit state.

## Anatomy Batch 72: Next queued source pages

- [x] Identify the next deterministic source-page range and export the immutable OCR baseline.
- [x] Inspect every queued original source page and record literal source findings.
- [x] Collect authoritative NCBI/PMC evidence for source-confirmed corrections.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [x] Checkpoint the completed Batch 72 audit state.

## Anatomy Batch 73: Pages 1989-2017

- [x] Export the immutable Batch 73 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 73 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [x] Checkpoint the completed Batch 73 audit state.

## Anatomy Batch 74: Pages 2018-2031

- [x] Export the immutable Batch 74 OCR records and inspect all ten queued original source pages.
- [x] Triage OCR, language, terminology, and medical-content risks without mutating the bank.
- [x] Collect authoritative NCBI/PMC evidence for each source-confirmed candidate correction.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all 74 Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [x] Checkpoint the completed Batch 74 audit state.

## Anatomy Batch 75: Next queued source pages

- [x] Identify the exact deterministic source-page range and export the immutable OCR baseline.
- [x] Inspect every queued original source page and record literal source findings.
- [x] Collect authoritative NCBI/PMC evidence for source-confirmed corrections.
- [x] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [x] Verify all Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [x] Checkpoint the completed Batch 75 audit state.

## Anatomy Batch 76: Next queued source pages

- [ ] Identify the exact deterministic source-page range and export the immutable OCR baseline.
- [ ] Inspect every queued original source page and record literal source findings.
- [ ] Collect authoritative NCBI/PMC evidence for source-confirmed corrections.
- [ ] Apply guarded source-faithful restorations and retain unresolved records as `needs_review`.
- [ ] Verify all Anatomy batch guards, regenerate audit coverage and queue reports, run typecheck, tests, and production build.
- [ ] Checkpoint the completed Batch 76 audit state.

## Revision interface integration: verified question bank

- [x] Stop the sequential Anatomy audit at the current checkpointed state without treating later batches as verified.
- [x] Define and document the eligibility rule that only approved, source-verified records can enter revision and mock exams.
- [x] Integrate eligible verified records into the revise flow with answer selection, explanation, learning aids, source trace, and progress persistence.
- [x] Update dashboard/revision copy so current verified-bank counts and restricted OCR states are accurately represented.
- [x] Add or update Vitest coverage for eligibility, revision flow data, and mock-exam exclusion safeguards.
- [x] Run typecheck, tests, production build, and responsive visual verification.
- [ ] Checkpoint the completed revision-interface integration.

## Trusted-source review access recovery
- [ ] Open the bundled OCR/source catalogue directly for trusted local review without requiring approval.
- [ ] Represent missing answer keys as ungraded records rather than blocking or marking them incorrect.
- [ ] Keep timed Primary mock selection strict for complete keyed records with blueprint metadata.
- [ ] Update Source library, dashboard, and review copy to distinguish direct review from mock eligibility.
- [ ] Add regression tests for trusted OCR review and strict mock exclusion.
- [ ] Run typecheck, tests, production build, responsive visual verification, and save a new checkpoint.
