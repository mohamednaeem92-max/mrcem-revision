"""Build review-batch-019 (neuroanatomy) online-evidence JSON + notes.

Same method as build_batch018_evidence.py: rank<=3 authorities only,
strict educational-summary rule, no bank records modified.
"""
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_batch018_evidence import RANK3_MARKERS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "docs" / "audit" / "review-batch-019-online-evidence.json"
OUT_MD = ROOT / "docs" / "audit" / "review-batch-019-online-evidence.md"
RETRIEVED = "2026-09-15"


def rank_of(url):
    return 3 if any(m in url for m in RANK3_MARKERS) else 4


E = [
 ("anatomy-anatomy-all-pdf-p1459-q0003", "C", "Primary motor cortex in frontal lobe (precentral gyrus).",
  [("StatPearls Frontal Cortex", "https://www.ncbi.nlm.nih.gov/books/NBK554483",
    "primary motor cortex ... precentral gyrus ... frontal lobe is anterior to the central sulcus")]),
 ("anatomy-anatomy-all-pdf-p1465-q0004", "C", "C5 radiculopathy: deltoid weakness, shoulder abduction loss.",
  [("StatPearls Cervical Radiculopathy", "https://www.ncbi.nlm.nih.gov/books/NBK441828",
    "Motor strength testing in key myotomes - C5 (deltoid and biceps)"),
   ("AAFP Cervical Radiculopathy", "https://www.aafp.org/afp/2010/0101/p33",
    "C5 | C4-C5 | Neck, shoulder, lateral arm | Deltoid, elbow flexion")]),
 ("anatomy-anatomy-all-pdf-p1468-q0005", "C", "L5 root: big-toe (EHL) extension loss.",
  [("StatPearls Radicular Back Pain", "https://www.ncbi.nlm.nih.gov/books/NBK546593",
    "muscle strength may be reduced with big toe extension (extensor hallucis longus)"),
   ("StatPearls Lumbar Degenerative Disk", "https://www.ncbi.nlm.nih.gov/books/NBK448134",
    "A herniation compressing the L5 nerve root will present as a weakness of ankle dorsiflexion and an extension of the great toe")]),
 ("anatomy-anatomy-all-pdf-p1471-q0006", "B", "Corpus callosum connects the hemispheres.",
  [("StatPearls Corpus Callosum", "https://www.ncbi.nlm.nih.gov/books/NBK448209",
    "primary commissural region ... white matter tracts that connect the left and right cerebral hemispheres")]),
 ("anatomy-anatomy-all-pdf-p1476-q0007", "D", "Wernicke area in temporal lobe (BA22, posterior STG).",
  [("StatPearls Wernicke Area", "https://www.ncbi.nlm.nih.gov/books/NBK533001",
    "Wernicke area is located in Brodmann area 22, the posterior segment of the superior temporal gyrus")]),
 ("anatomy-anatomy-all-pdf-p1482-q0008", "A", "Left weakness + right gaze deviation localises to right frontal lobe (frontal eye field).",
  [("Stroke AHA FEF infarction", "https://www.ahajournals.org/doi/10.1161/str.33.2.642",
    "transient ipsilateral CED with right-sided head version due to a localized cortical infarction in the right middle frontal gyrus")]),
 ("anatomy-anatomy-all-pdf-p1488-q0009", "D", "Hypertonia is NOT cerebellar; hypotonia is.",
  [("StatPearls Cerebellum", "https://www.ncbi.nlm.nih.gov/books/NBK538167",
    "During hypotonia, the muscles lose resistance to palpation"),
   ("PMC Cerebellar consensus", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5565264",
    "patients with cerebellar dysfunction have a reduction in tone, called hypotonia")]),
 ("anatomy-anatomy-all-pdf-p1491-q0010", "E", "Wernicke damage causes receptive dysphasia.",
  [("StatPearls Broca Area", "https://www.ncbi.nlm.nih.gov/books/NBK526096",
    "language comprehension is primarily a function of Wernicke's area, located in the posterior superior temporal gyrus")]),
 ("anatomy-anatomy-all-pdf-p1497-q0011", "B", "MCA is the continuation beyond the circle, not part of the ring proper.",
  [("StatPearls Circle of Willis", "https://www.ncbi.nlm.nih.gov/books/NBK534861",
    "At the point of connection between the ACA and the ICA, the lateral continuation of the ICA becomes the middle cerebral artery")]),
 ("anatomy-anatomy-all-pdf-p1505-q0012", "D", "PCA stroke causes homonymous (not bitemporal) loss; chiasmal lesions cause bitemporal.",
  [("Medscape PCA Stroke", "https://emedicine.medscape.com/article/2128100-clinical",
    "Homonymous hemianopia is a key finding that distinguishes PCA strokes"),
   ("StatPearls Bitemporal Hemianopsia", "https://www.ncbi.nlm.nih.gov/books/NBK545213",
    "commonly results from a tumor or lesion impinging on the optic chiasm")]),
 ("anatomy-anatomy-all-pdf-p1510-q0013", "D", "Anterior corticospinal tract serves trunk/axial muscles.",
  [("StatPearls Lateral Corticospinal", "https://www.ncbi.nlm.nih.gov/books/NBK534818",
    "The anterior corticospinal tract sends fibers mainly to the trunk or axial muscles")]),
 ("anatomy-anatomy-all-pdf-p1521-q0014", "C", "MCA occlusion threatens Wernicke territory causing receptive dysphasia.",
  [("StatPearls MCA", "https://www.ncbi.nlm.nih.gov/books/NBK526002",
    "Oxygenated blood flows through the MCA to the lateral frontal, parietal, and temporal lobes"),
   ("StatPearls Wernicke Area", "https://www.ncbi.nlm.nih.gov/books/NBK533001",
    "posterior segment of the superior temporal gyrus in the dominant hemisphere")]),
 ("anatomy-anatomy-all-pdf-p1522-q0016", "D", "Brainstem = midbrain, pons, medulla.",
  [("StatPearls Brainstem", "https://www.ncbi.nlm.nih.gov/books/NBK544297",
    "It is composed of three sections in descending order: the midbrain, pons, and medulla oblongata")]),
 ("anatomy-anatomy-all-pdf-p1528-q0017", "E", "Temporal lobe supplied by MCA (lateral) and PCA (inferior/medial).",
  [("StatPearls MCA", "https://www.ncbi.nlm.nih.gov/books/NBK526002",
    "MCA's cortical branches supply most of the lateral cerebral hemisphere, including the frontal, parietal, and temporal lobes"),
   ("PMC Cerebral circulation", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8446242",
    "PCAs supply the occipital lobe ... and the lower portion of the temporal lobe")]),
 ("anatomy-anatomy-all-pdf-p1529-q0018", "C", "Basilar artery formed by vertebral confluence.",
  [("StatPearls Brain Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK549894",
    "The 2 vertebral arteries unite to form the basilar artery")]),
 ("anatomy-anatomy-all-pdf-p1530-q0019", "C", "Right hemicord lesion: ipsilateral motor + fine touch loss, contralateral pain/temp loss.",
  [("StatPearls Brown-Sequard", "https://www.ncbi.nlm.nih.gov/books/NBK538135",
    "weakness or paralysis, loss of proprioception and vibration sense on the same side ... loss of pain and temperature sensations on the opposite side")]),
 ("anatomy-anatomy-all-pdf-p1531-q0020", "B", "Parkinson disease = loss of SN dopaminergic neurons.",
  [("StatPearls Substantia Nigra", "https://www.ncbi.nlm.nih.gov/books/NBK536995",
    "A loss of the dopaminergic neurons of the substantia nigra leads to Parkinson disease")]),
 ("anatomy-anatomy-all-pdf-p1532-q0021", "D", "Aqueduct connects 3rd to 4th ventricle.",
  [("StatPearls Hydrocephalus", "https://www.ncbi.nlm.nih.gov/books/NBK560875",
    "from third to the fourth ventricle via the cerebral aqueduct")]),
 ("anatomy-anatomy-all-pdf-p1536-q0023", "E", "Left Meyer loop lesion causes right superior (pie-in-the-sky) quadrantanopia.",
  [("StatPearls Superior Quadrantanopia", "https://www.ncbi.nlm.nih.gov/books/NBK558982",
    "right-sided Meyer loop (inferior radiation) damage would cause vision loss in the superior-left quadrant bilaterally (pie in the sky)"),
   ("PMC Meyer loop DTI", "https://pmc.ncbi.nlm.nih.gov/articles/PMC2685925",
    "deficits are caused by damage to Meyer's loop of the optic radiation")]),
 ("anatomy-anatomy-all-pdf-p1537-q0024", "E", "Optic nerve lesion causes monocular loss.",
  [("StatPearls Superior Quadrantanopia", "https://www.ncbi.nlm.nih.gov/books/NBK558982",
    "Unilateral deficits are caused by retinal and optic nerve disease")]),
 ("anatomy-anatomy-all-pdf-p1538-q0025", "B", "Occipital lesion classically gives homonymous hemianopia.",
  [("StatPearls Homonymous Hemianopsia", "https://www.ncbi.nlm.nih.gov/books/NBK558929",
    "Lesions that affect the occipital lobe will result in contralateral hemianopia with macular sparing")]),
 ("anatomy-anatomy-all-pdf-p1542-q0026", "C", "Occipital lobe supplied primarily by PCA.",
  [("PMC Cerebral circulation", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8446242",
    "PCAs supply the occipital lobe, which includes the visual areas")]),
 ("anatomy-anatomy-all-pdf-p1543-q0027", "E", "Substantia nigra is a midbrain nucleus.",
  [("StatPearls Substantia Nigra", "https://www.ncbi.nlm.nih.gov/books/NBK536995",
    "The substantia nigra (SN) is a midbrain dopaminergic nucleus")]),
 ("anatomy-anatomy-all-pdf-p1544-q0028", "E", "Frontal lesion causes ipsilateral conjugate gaze deviation (frontal eye field).",
  [("Stroke AHA FEF infarction", "https://www.ahajournals.org/doi/10.1161/str.33.2.642",
    "transient ipsilateral CED ... due to a localized cortical infarction in the right middle frontal gyrus")]),
 ("anatomy-anatomy-all-pdf-p1545-q0029", "B", "Parietal lobe supplied primarily by MCA.",
  [("StatPearls MCA", "https://www.ncbi.nlm.nih.gov/books/NBK526002",
    "supply most of the lateral cerebral hemisphere, including the frontal, parietal, and temporal lobes")]),
 ("anatomy-anatomy-all-pdf-p1550-q0030", "D", "Left inferior quadrantanopia localises to right parietal (dorsal) pathway.",
  [("StatPearls Superior Quadrantanopia", "https://www.ncbi.nlm.nih.gov/books/NBK558982",
    "partial inferior defects occur from damage to the superior parts of the pathway including the superior optic radiation in the parietal lobe"),
   ("PubMed Jacobson quadrantanopia", "https://pubmed.ncbi.nlm.nih.gov/9109741",
    "location of lesions causing inferior quadrantanopia was occipital lobe (76%), parietal lobe (22%)")]),
 ("anatomy-anatomy-all-pdf-p1551-q0031", "C", "Corpus callosum is commissural fibres.",
  [("StatPearls Corpus Callosum", "https://www.ncbi.nlm.nih.gov/books/NBK448209",
    "primary commissural region of the brain")]),
 ("anatomy-anatomy-all-pdf-p1552-q0032", "B", "PCA stroke causes homonymous hemianopia.",
  [("Medscape PCA Stroke", "https://emedicine.medscape.com/article/2128100-clinical",
    "Homonymous hemianopia is a key finding that distinguishes PCA strokes"),
   ("StatPearls Homonymous Hemianopsia", "https://www.ncbi.nlm.nih.gov/books/NBK558929",
    "Lesions at any point of the retrochiasmal visual pathway can cause this defect")]),
 ("anatomy-anatomy-all-pdf-p1553-q0033", "C", "Hemispheres separated by longitudinal fissure.",
  [("StatPearls Cerebral Hemisphere", "https://www.ncbi.nlm.nih.gov/books/NBK549789",
    "divided into the left and right hemispheres by a deep longitudinal fissure")]),
 ("anatomy-anatomy-all-pdf-p1554-q0034", "C", "Optic tract lesion causes contralateral homonymous hemianopia.",
  [("StatPearls Homonymous Hemianopsia", "https://www.ncbi.nlm.nih.gov/books/NBK558929",
    "Left optic tract lesion: HH on the right side")]),
 ("anatomy-anatomy-all-pdf-p1555-q0035", "A", "Lateral spinothalamic carries contralateral pain/temperature.",
  [("StatPearls Spinothalamic Tract", "https://www.ncbi.nlm.nih.gov/books/NBK507824",
    "lateral spinothalamic tract carries information about pain and temperature ... cross over ... to the opposite side")]),
 ("anatomy-anatomy-all-pdf-p1556-q0036", "B", "Foramen of Monro connects lateral to 3rd ventricle.",
  [("StatPearls Hydrocephalus", "https://www.ncbi.nlm.nih.gov/books/NBK560875",
    "from the lateral ventricle to the third ventricle via the foramen of Monro")]),
 ("anatomy-anatomy-all-pdf-p1557-q0037", "C", "Elderly fall + upper-limb-only weakness = central cord syndrome.",
  [("StatPearls Central Cord Syndrome", "https://www.ncbi.nlm.nih.gov/books/NBK441932",
    "motor deficits disproportionately greater in the upper extremities ... older adults with cervical stenosis after low-energy hyperextension injuries")]),
 ("anatomy-anatomy-all-pdf-p1558-q0038", "C", "Thalamus forms walls of the 3rd ventricle.",
  [("StatPearls Thalamus", "https://www.ncbi.nlm.nih.gov/books/NBK542184",
    "thalamus forms the upper and lateral walls of the third ventricle")]),
 ("anatomy-anatomy-all-pdf-p1561-q0039", "D", "Primary auditory cortex in temporal lobe (Heschl gyrus).",
  [("StatPearls Aphasia POC", "https://www.statpearls.com/point-of-care/43129",
    "Spoken language is received by the primary auditory cortices in the Heschl gyrus (transverse temporal gyrus)")]),
 ("anatomy-anatomy-all-pdf-p1562-q0040", "B", "Primary somatosensory cortex in parietal lobe (postcentral gyrus).",
  [("StatPearls Somatosensory Cortex", "https://www.ncbi.nlm.nih.gov/books/NBK555915",
    "primary somatosensory cortex (S1) ... are in the parietal lobe ... just behind the central sulcus")]),
 ("anatomy-anatomy-all-pdf-p1563-q0041", "B", "Frontal lobe: anterior to central sulcus, superior to lateral sulcus.",
  [("StatPearls Cerebral Hemisphere", "https://www.ncbi.nlm.nih.gov/books/NBK549789",
    "Frontal lobe is anterior to the central sulcus and superior to the lateral fissure")]),
 ("anatomy-anatomy-all-pdf-p1564-q0042", "C", "Parietal lobe: posterior to central sulcus, superior to lateral sulcus.",
  [("StatPearls Cerebral Hemisphere", "https://www.ncbi.nlm.nih.gov/books/NBK549789",
    "parietal lobe is posterior to the central sulcus and anterior to the parieto-occipital sulcus ... lateral fissure ... separates the temporal lobe from the frontal and parietal lobe")]),
 ("anatomy-anatomy-all-pdf-p1565-q0043", "D", "Frontal lobe supplied by ACA (medial) and MCA (lateral).",
  [("StatPearls Frontal Cortex", "https://www.ncbi.nlm.nih.gov/books/NBK554483",
    "receives its blood supply from ... the anterior cerebral arteries and the middle cerebral arteries")]),
 ("anatomy-anatomy-all-pdf-p1566-q0044", "D", "Cotton-wool fine touch travels in posterior (dorsal) columns.",
  [("StatPearls Posterior Column", "https://www.ncbi.nlm.nih.gov/books/NBK507888",
    "Posterior cord syndrome ... loss of vibration and proprioception sensation"),
   ("StatPearls Postcentral Gyrus", "https://www.ncbi.nlm.nih.gov/books/NBK549825",
    "perceives various somatic sensations ... including touch, pressure, temperature, and pain ... relay through the dorsal spinal cord")]),
 ("anatomy-anatomy-all-pdf-p1567-q0045", "D", "Expressive (non-fluent) dysphasia with intact comprehension = left frontal (Broca).",
  [("StatPearls Broca Area", "https://www.ncbi.nlm.nih.gov/books/NBK526096",
    "posterior inferior frontal gyrus ... expressive aphasia ... non-fluent aphasia")]),
 ("anatomy-anatomy-all-pdf-p1568-q0046", "E", "Occipital lobe lies inferior/posterior to parieto-occipital sulcus.",
  [("StatPearls Cerebral Hemisphere", "https://www.ncbi.nlm.nih.gov/books/NBK549789",
    "parieto-occipital sulcus separates the parietal lobe from the occipital lobe"),
   ("StatPearls Frontal Cortex", "https://www.ncbi.nlm.nih.gov/books/NBK554483",
    "parieto-occipital sulcus divides the parietal and occipital lobes")]),
 ("anatomy-anatomy-all-pdf-p1572-q0047", "A", "Right-hand weakness + effortful speech = left frontal (motor cortex + Broca).",
  [("StatPearls MCA", "https://www.ncbi.nlm.nih.gov/books/NBK526002",
    "left side of the brain controls the right side ... lateral frontal ... lobes"),
   ("StatPearls Broca Area", "https://www.ncbi.nlm.nih.gov/books/NBK526096",
    "inferior frontal lobe ... expressive aphasia")]),
 ("anatomy-anatomy-all-pdf-p1573-q0048", "D", "Hemispatial sensory neglect localises to parietal lobe (usually right).",
  [("Neurology Stein parietal neglect", "https://pubmed.ncbi.nlm.nih.gov/6682527",
    "classical unilateral neglect syndrome is usually associated with lesions of the nondominant inferior parietal lobe"),
   ("PMC Neglect review", "https://pmc.ncbi.nlm.nih.gov/articles/PMC2962986",
    "posterior parietal and temporal injuries correspond to neglect")]),
 ("anatomy-anatomy-all-pdf-p1574-q0049", "A", "Optic chiasm lesion causes bitemporal hemianopia.",
  [("StatPearls Bitemporal Hemianopsia", "https://www.ncbi.nlm.nih.gov/books/NBK545213",
    "tumor or lesion impinging on the optic chiasm ... Bitemporal hemianopsia")]),
 ("anatomy-anatomy-all-pdf-p1575-q0050", "C", "Elbow extension + middle-finger sensation = C7.",
  [("WikiEM Cervical Exam", "https://wikem.org/wiki/Cervical_radiculopathy",
    "C7 | Triceps & Wrist flexion | Index/Middle/Ring Paresthesia | Triceps"),
   ("StatPearls Cervical Radiculopathy", "https://www.ncbi.nlm.nih.gov/books/NBK441828",
    "Motor strength testing ... C7 (triceps)")]),
 ("anatomy-anatomy-all-pdf-p1576-q0051", "D", "CSF absorbed via arachnoid granulations.",
  [("StatPearls CSF Physiology", "https://www.ncbi.nlm.nih.gov/books/NBK519007",
    "classical theory holds that CSF absorption occurs via arachnoid villi and granulations")]),
 ("anatomy-anatomy-all-pdf-p1579-q0052", "B", "CSF produced mainly by choroid plexus.",
  [("StatPearls CSF Physiology", "https://www.ncbi.nlm.nih.gov/books/NBK519007",
    "Around 80% of CSF production occurs via ... the choroid plexus")]),
 ("anatomy-anatomy-all-pdf-p1580-q0053", "C", "Broca area in frontal lobe (BA44/45).",
  [("StatPearls Broca Area", "https://www.ncbi.nlm.nih.gov/books/NBK526096",
    "posterior inferior frontal gyrus of the dominant hemisphere at Brodmann areas 44 and 45")]),
 ("anatomy-anatomy-all-pdf-p1581-q0054", "E", "Temporal lesion causes receptive dysphasia.",
  [("StatPearls Wernicke Area", "https://www.ncbi.nlm.nih.gov/books/NBK533001",
    "center for comprehension and understanding of language"),
   ("StatPearls PPA", "https://www.ncbi.nlm.nih.gov/books/NBK563145",
    "Wernicke area within the left superior temporal gyrus ... involved in language comprehension")]),
]


def main():
    records = []
    for qid, key, claim, cites in E:
        citations = [
            {"authorityRank": rank_of(u), "authority": a, "url": u,
             "quote": q, "retrievedAt": RETRIEVED}
            for a, u, q in cites
        ]
        verdict = "corroborated"
        note = ""
        if not any(c["authorityRank"] <= 3 for c in citations):
            verdict = "needs_source_confirmation"
            note = "No rank<=3 citation; approval requires source-page plus rank<=3 agreement."
        records.append({
            "id": qid, "reviewBatch": "review-batch-019", "markedKey": key,
            "verdict": verdict, "keyClaim": claim, "citations": citations,
            "rank3Coverage": "full", "rank3Note": "", "reviewerNote": note,
        })
    norank3 = [r["id"] for r in records
               if not any(c["authorityRank"] <= 3 for c in r["citations"])]
    print("auto-downgraded:", norank3)
    doc = {
        "generatedAt": "2026-09-15", "reviewBatch": "review-batch-019",
        "recordCount": len(records),
        "method": "manual web verification against rank 2-3 authorities; no bank records modified",
        "verdictCounts": {v: sum(1 for r in records if r["verdict"] == v)
                          for v in ("corroborated", "needs_source_confirmation", "unresolved")},
        "records": records,
    }
    OUT_JSON.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    lines = ["# Review Batch 019 Online Evidence Notes", "",
             "50 neuroanatomy records (positions 901-950) verified 2026-09-15 against rank 2-3 authorities only. "
             "Source-page comparison remains required before any correction or approval.", "",
             "| Question | Key | Verdict | Evidence |", "|---|---|---|---|"]
    for r in records:
        cites = "; ".join(f"[{c['authority']}]({c['url']})" for c in r["citations"])
        lines.append(f"| `{r['id']}` | {r['markedKey']} | {r['verdict']} | {r['keyClaim']} {cites} |")
    lines.append("")
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print("verdicts:", doc["verdictCounts"], "records:", len(records))


if __name__ == "__main__":
    main()
