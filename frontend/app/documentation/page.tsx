"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import SimplifiedGlassSurface from "@/components/SimplifiedGlassSurface"

/* ─────────────────────────── types ─────────────────────────── */

interface DocSubsection {
  id: string
  title: string
  content: React.ReactNode
}

interface DocSection {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  description: string
  subsections: DocSubsection[]
}

/* ─────────────────────────── icons ─────────────────────────── */

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ServerIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
  </svg>
)

const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const BeakerIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
)

/* ─────────────────────────── code block component ─────────────────────────── */

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 p-4 bg-[#1a1a2e] rounded-xl overflow-x-auto border border-white/5">
      <pre className="text-xs text-green-400 font-mono leading-relaxed">
        {lines.join("\n")}
      </pre>
    </div>
  )
}

/* ─────────────────────────── doc content ─────────────────────────── */

const sections: DocSection[] = [
  {
    id: "glycoshield",
    title: "GlycoShield",
    icon: <ShieldIcon />,
    color: "#8B7DFF",
    description: "Ensemble-based atomistic modeling and quantification of glycan shielding on viral surface proteins.",
    subsections: [
      {
        id: "glycoshield-overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="text-black/70 leading-relaxed">
              Many clinically important enveloped viruses mask their surface proteins with a dense layer of host-derived sugars, known as the <span className="font-medium text-black/80">glycan shield</span>. This sugar coating acts as a powerful immune evasion mechanism by sterically blocking antibody access to the underlying protein surface and, in some cases, directly participating in antibody recognition.
            </p>
            <p className="text-black/70 leading-relaxed">
              Because these surface glycoproteins are the primary targets of neutralizing antibodies and vaccines, understanding how glycan shielding operates is central to rational immunogen design.
            </p>
          </div>
        ),
      },
      {
        id: "glycoshield-why-computational",
        title: "Why Computational Modeling?",
        content: (
          <p className="text-black/70 leading-relaxed">
            Glycans are notoriously difficult to characterize experimentally. Their intrinsic flexibility, chemical heterogeneity, and rapid motion mean that most structural methods resolve only a small fraction of the glycan mass. What ultimately governs immune accessibility is not a single glycan conformation, but the cumulative, time-averaged effect of many dynamically fluctuating configurations. Computational modeling is therefore essential to bridge this gap.
          </p>
        ),
      },
      {
        id: "glycoshield-ensemble",
        title: "Ensemble-Based Atomistic Modeling",
        content: (
          <p className="text-black/70 leading-relaxed">
            This platform employs an ensemble-based atomistic modeling approach (building on <span className="font-medium text-black/80">ALLOSMOD</span> from Sali lab) to capture glycan behavior realistically. Starting from an experimentally determined protein scaffold, individual glycans are modeled at their glycosylation sites and extensively sampled using energy minimization and simulated annealing. Thousands of distinct conformations are generated to form an ensemble that represents the accessible conformational space of the fully glycosylated protein.
          </p>
        ),
      },
      {
        id: "glycoshield-gef",
        title: "Glycan Encounter Factor (GEF)",
        content: (
          <p className="text-black/70 leading-relaxed">
            Shielding is quantified using the <span className="font-medium text-black/80">Glycan Encounter Factor (GEF)</span>, which measures the probability that an approaching probe—representing the first line of antibody contact—encounters glycan atoms before reaching the protein surface. GEF produces spatial maps that distinguish persistently shielded regions from potential sites of vulnerability.
          </p>
        ),
      },
      {
        id: "glycoshield-network",
        title: "Glycan–Glycan Network Analysis",
        content: (
          <p className="text-black/70 leading-relaxed">
            The glycan shield is analyzed as a network, where glycans are nodes connected by ensemble-averaged volume overlap. Network analysis reveals highly connected glycan clusters, sparsely protected regions, and collective behaviors that shape global immune accessibility.
          </p>
        ),
      },
    ],
  },
  {
    id: "vasco",
    title: "VASCO",
    icon: <LightningIcon />,
    color: "#FF6B9D",
    description: "Viral Antibody Structural Complex Analysis — structure-based interface prediction with deep learning.",
    subsections: [
      {
        id: "vasco-overview",
        title: "What is VASCO?",
        content: (
          <p className="text-black/70 leading-relaxed">
            VASCO is a structure-based computational platform for predicting antibody–antigen binding interfaces, designed to identify both <span className="font-medium text-black/80">paratope residues</span> on antibodies and <span className="font-medium text-black/80">epitope residues</span> on antigens. The goal is to provide rapid, interpretable insights into molecular recognition that can guide experimental design, antibody engineering, and vaccine development.
          </p>
        ),
      },
      {
        id: "vasco-input",
        title: "Input Requirements",
        content: (
          <div className="space-y-3">
            <p className="text-black/70 leading-relaxed">
              VASCO takes as input two three-dimensional PDB structures:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
                <span><span className="font-medium text-black/80">Antibody Fab structure</span>, containing one heavy chain (chain H) and one light chain (chain L)</span>
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
                <span><span className="font-medium text-black/80">Antigen structure</span>, corresponding to the viral protein of interest</span>
              </li>
            </ul>
            <div className="mt-3 p-3 bg-black/5 rounded-xl">
              <p className="text-sm text-black/60 leading-relaxed italic">
                Input structures may be experimentally determined (X-ray, cryo-EM, NMR) or computationally predicted (homology modeling, AlphaFold). This flexibility allows VASCO to be used even when experimental complexes are unavailable.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "vasco-output",
        title: "What You Get",
        content: (
          <div className="space-y-3">
            <p className="text-black/70 leading-relaxed">VASCO produces residue-level predictions that include:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
                <span>Binding probability scores for each residue on the antibody and antigen</span>
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
                <span>Identification of likely paratope and epitope residues</span>
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
                <span>Relative importance of residues, derived from learned masking mechanisms</span>
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "vasco-use-cases",
        title: "Use Cases",
        content: (
          <ul className="space-y-2 ml-1">
            <li className="flex items-start gap-3 text-black/70">
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
              <span><span className="font-medium text-black/80">Prediction</span> — Identify likely binding interfaces for new antibody–antigen pairs</span>
            </li>
            <li className="flex items-start gap-3 text-black/70">
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
              <span><span className="font-medium text-black/80">Screening</span> — Compare multiple antibodies or antigen variants to prioritize candidates</span>
            </li>
            <li className="flex items-start gap-3 text-black/70">
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FF6B9D]" />
              <span><span className="font-medium text-black/80">Hypothesis generation</span> — Suggest mutations, validate experimental observations, or explore alternative binding modes</span>
            </li>
          </ul>
        ),
      },
      {
        id: "vasco-why",
        title: "Why VASCO Works",
        content: (
          <p className="text-black/70 leading-relaxed">
            Because the model integrates sequence-derived features, structural context, and learned attention and masking, its predictions are not only accurate but also biophysically interpretable. VASCO complements physics-based modeling and experimental approaches by enabling fast, scalable, and hypothesis-driven exploration of antibody–antigen interactions across diverse viral systems.
          </p>
        ),
      },
    ],
  },
  {
    id: "input-files",
    title: "Input File Reference",
    icon: <FileIcon />,
    color: "#10B981",
    description: "Detailed specifications for all required input files across GLACIER tools.",
    subsections: [
      {
        id: "input-align-ali",
        title: "align.ali — Sequence Alignment",
        content: (
          <div className="space-y-4">
            <p className="text-black/70 leading-relaxed">
              GlycoShield uses a <span className="font-medium text-black/80">MODELLER-style alignment file</span>, named <code className="px-1.5 py-0.5 bg-black/5 rounded text-sm font-mono">align.ali</code>, to define the relationship between template structures and the target protein. This alignment generates structural restraints during model construction and ensemble generation.
            </p>
            <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
              <h5 className="font-medium text-black/80 mb-2">File Format</h5>
              <p className="text-sm text-black/60 leading-relaxed mb-3">
                The file must follow Sali Lab MODELLER alignment syntax and contain one entry for each template PDB file plus one target sequence entry named <code className="px-1 py-0.5 bg-black/5 rounded text-xs font-mono">pm.pdb</code>. Each entry begins with a <code className="px-1 py-0.5 bg-black/5 rounded text-xs font-mono">&gt;P1;</code> header.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-sm text-black/60">
                  <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-[#10B981]" />
                  <span>Multiple chains: separate with <code className="px-1 py-0.5 bg-black/5 rounded text-xs font-mono">/</code> following MODELLER conventions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-black/60">
                  <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-[#10B981]" />
                  <span>Chain order and residue numbering must be consistent between alignment and PDB</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-black/60">
                  <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-[#10B981]" />
                  <span>Each sequence must end with a terminating <code className="px-1 py-0.5 bg-black/5 rounded text-xs font-mono">*</code></span>
                </li>
              </ul>
            </div>
            <div className="p-4 border-l-2 border-orange-400 bg-orange-50/50 rounded-lg">
              <h5 className="font-semibold text-orange-700 mb-1">⚠️ Critical: Alignment Quality</h5>
              <p className="text-sm text-orange-600/80 leading-relaxed">
                Small alignment errors can lead to large structural artifacts during simulation. Avoid misalignments where adjacent residues are aligned far apart, pay attention to chain termini where errors often occur, and ensure gaps and insertions are biologically reasonable.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "input-glyc-dat",
        title: "glyc.dat — Glycosylation Input",
        content: (
          <div className="space-y-4">
            <p className="text-black/70 leading-relaxed">
              The glycosylation input file must be named <code className="px-1.5 py-0.5 bg-black/5 rounded text-sm font-mono">glyc.dat</code>. It defines the explicit chemical structure of each glycan at the monomer-by-monomer level following Sali Lab/MODELLER glycosylation format.
            </p>
            <div className="p-3 bg-black/5 rounded-xl">
              <p className="text-sm text-black/60 font-mono">
                Each line: &lt;monomer_name&gt; &lt;bond_type&gt; &lt;attachment_residue_index&gt;
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
                <h5 className="font-medium text-black/80 mb-2 text-sm">Supported Monomers</h5>
                <ul className="space-y-1 text-xs text-black/60">
                  <li><code className="font-mono text-[#10B981]">NAG</code> — β-N-Acetyl-D-Glucosamine</li>
                  <li><code className="font-mono text-[#10B981]">NGA</code> — β-N-Acetyl-D-Galactosamine</li>
                  <li><code className="font-mono text-[#10B981]">GLB</code> — β-Galactose</li>
                  <li><code className="font-mono text-[#10B981]">FUC</code> — α-Fucose</li>
                  <li><code className="font-mono text-[#10B981]">MAN</code> — α-Mannose</li>
                  <li><code className="font-mono text-[#10B981]">BMA</code> — β-Mannose</li>
                  <li><code className="font-mono text-[#10B981]">NAN</code> — α-Neuraminic acid</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
                <h5 className="font-medium text-black/80 mb-2 text-sm">Bond Types</h5>
                <ul className="space-y-1 text-xs text-black/60">
                  <li><span className="font-mono text-[#10B981]">NGLA/NGLB</span> — to ASN</li>
                  <li><span className="font-mono text-[#10B981]">SGPA/SGPB</span> — to SER</li>
                  <li><span className="font-mono text-[#10B981]">TGPA/TGPB</span> — to THR</li>
                  <li><span className="font-mono text-[#10B981]">16ab, 14bb, 13ab</span> — glycan–glycan</li>
                  <li><span className="font-mono text-[#10B981]">sa23, sa26</span> — sialic acid</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-black/80 mb-2 text-sm">Example: Mannose-9 at residue 58</h5>
              <CodeBlock lines={[
                "NAG NGLB 58",
                "NAG 14bb 1",
                "BMA 14bb 2",
                "MAN 13ab 3",
                "MAN 16ab 3",
                "MAN 13ab 5",
                "MAN 16ab 5",
                "MAN 12aa 7",
                "MAN 12aa 6",
                "MAN 12aa 4",
                "MAN 12aa 10",
              ]} />
            </div>

            <div>
              <h5 className="font-medium text-black/80 mb-2 text-sm">Example: Fucosylated two-antennae at residue 608</h5>
              <CodeBlock lines={[
                "NAG NGLB 608",
                "NAG 14bb 1",
                "BMA 14bb 2",
                "MAN 13ab 3",
                "MAN 16ab 3",
                "NAG 12ba 4",
                "NAG 12ba 5",
                "GLB 14bb 6",
                "GLB 14bb 7",
                "NAN sa23 8",
                "NAN sa23 9",
                "FUC 16fu 1",
              ]} />
            </div>
          </div>
        ),
      },
      {
        id: "input-pdb",
        title: ".pdb — Protein Structure",
        content: (
          <div className="space-y-3">
            <p className="text-black/70 leading-relaxed">
              Standard <span className="font-medium text-black/80">Protein Data Bank</span> format file containing atomic coordinates. This serves as the structural scaffold for all modeling.
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-3 text-sm text-black/60">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#10B981]" />
                <span>For GlycoShield: protein structure with glycosylation sites annotated</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-black/60">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#10B981]" />
                <span>For VASCO: separate antibody Fab (chains H+L) and antigen structures</span>
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "input-dat",
        title: "input.dat — AllosMod Configuration",
        content: (
          <div className="space-y-3">
            <p className="text-black/70 leading-relaxed">
              Configuration parameters for the AllosMod modeling pipeline. Contains key settings like <code className="px-1.5 py-0.5 bg-black/5 rounded text-sm font-mono">NRUNS</code> (number of ensemble runs) and other simulation parameters.
            </p>
            <div className="p-3 bg-black/5 rounded-xl">
              <p className="text-sm text-black/60 leading-relaxed italic">
                The NRUNS parameter directly controls the number of SLURM array jobs submitted to the HPC cluster. Higher values produce more thorough ensemble sampling but increase compute time.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "pipeline",
    title: "Pipeline & Workflow",
    icon: <BeakerIcon />,
    color: "#F59E0B",
    description: "End-to-end processing workflow from file upload to results delivery.",
    subsections: [
      {
        id: "pipeline-overview",
        title: "Processing Overview",
        content: (
          <div className="space-y-4">
            <div className="grid gap-3">
              {[
                { step: "1", title: "Upload & Validation", desc: "Files are uploaded to the FastAPI backend and validated for completeness. Folder structure is preserved for batch processing." },
                { step: "2", title: "HPC Transfer", desc: "Files are securely transferred via SSH to Northeastern University's HPC cluster (explorer.northeastern.edu)." },
                { step: "3", title: "Ensemble Generation", desc: "GPU-accelerated AllosMod molecular dynamics generates ~995 conformational frames per structure." },
                { step: "4", title: "Alignment & GEF Analysis", desc: "VMD-based trajectory alignment followed by parallel GEF computation using a 3×3 matrix approach. Runtime: 4–6 hours (optimized from 30+ hours)." },
                { step: "5", title: "Results & Notification", desc: "Email notification with download links for envelope graphs, statistical analysis, and comprehensive output files." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-black/80 text-sm">{item.title}</h5>
                    <p className="text-sm text-black/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "pipeline-infrastructure",
        title: "Infrastructure",
        content: (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
              <h5 className="font-medium text-black/80 mb-2 text-sm">Frontend</h5>
              <ul className="space-y-1.5 text-sm text-black/60">
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> Next.js 14 with React 18</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> TypeScript for type safety</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> Glassmorphism UI with Framer Motion</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> Deployed on Render.com</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
              <h5 className="font-medium text-black/80 mb-2 text-sm">Backend</h5>
              <ul className="space-y-1.5 text-sm text-black/60">
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> Python FastAPI on Render.com</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> SSH connection to HPC cluster</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> SLURM job scheduling</li>
                <li className="flex items-start gap-2"><span className="text-[#F59E0B]">•</span> Gmail SMTP for notifications</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "pipeline-hpc",
        title: "HPC Resources",
        content: (
          <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
            <ul className="space-y-2 text-sm text-black/70">
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] font-medium">→</span>
                <span><span className="font-medium text-black/80">Cluster:</span> explorer.northeastern.edu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] font-medium">→</span>
                <span><span className="font-medium text-black/80">Partition:</span> &quot;short&quot; (up to 48 hours runtime)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] font-medium">→</span>
                <span><span className="font-medium text-black/80">Resources:</span> 1024 cores, 25TB RAM available</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] font-medium">→</span>
                <span><span className="font-medium text-black/80">Software:</span> VMD/1.9.4a55, allosmod-env</span>
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "pipeline-notifications",
        title: "Email Notifications",
        content: (
          <div className="space-y-3">
            <p className="text-black/70 leading-relaxed">You receive emails at two stages:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#F59E0B]" />
                <span><span className="font-medium text-black/80">Job submission</span> — acknowledgment with job IDs and results URL</span>
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#F59E0B]" />
                <span><span className="font-medium text-black/80">Completion</span> — notification with download links for all output files</span>
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <ServerIcon />,
    color: "#6366F1",
    description: "Step-by-step guides for running your first analysis on the GLACIER platform.",
    subsections: [
      {
        id: "getting-started-glycoshield",
        title: "Run a GlycoShield Analysis",
        content: (
          <div className="space-y-4">
            <ol className="space-y-3">
              {[
                { step: "1", text: "Navigate to the GlycoShield page from the home screen." },
                { step: "2", text: "Prepare a folder containing your .pdb, .ali, glyc.dat, and input.dat files." },
                { step: "3", text: "Upload the folder (drag & drop or browse). The platform validates required files automatically." },
                { step: "4", text: "Configure the number of ensemble runs and set GEF probe radius if needed." },
                { step: "5", text: "Enter your email address for notifications and submit." },
                { step: "6", text: "You'll receive a results URL immediately and email notifications when processing completes." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3 text-black/70">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#6366F1] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {item.step}
                  </span>
                  <span className="text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ol>
            <div className="flex gap-3 mt-4">
              <Link
                href="/glycoshield"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B7DFF] text-white rounded-lg text-sm font-medium hover:bg-[#7B6DFF] transition-colors cursor-pointer"
              >
                Start GlycoShield Analysis →
              </Link>
            </div>
          </div>
        ),
      },
      {
        id: "getting-started-vasco",
        title: "Run a VASCO Prediction",
        content: (
          <div className="space-y-4">
            <ol className="space-y-3">
              {[
                { step: "1", text: "Navigate to the VASCO page from the home screen." },
                { step: "2", text: "Upload your antibody Fab PDB (chains H and L) and antigen PDB separately." },
                { step: "3", text: "Enter your email address for notifications and submit." },
                { step: "4", text: "VASCO analysis typically completes within 4–8 hours (MSA generation, deep learning inference, and visualization)." },
                { step: "5", text: "Results include per-residue binding probabilities and importance scores." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3 text-black/70">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FF6B9D] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {item.step}
                  </span>
                  <span className="text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ol>
            <div className="flex gap-3 mt-4">
              <Link
                href="/vasco"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B9D] text-white rounded-lg text-sm font-medium hover:bg-[#e85d8d] transition-colors cursor-pointer"
              >
                Start VASCO Prediction →
              </Link>
            </div>
          </div>
        ),
      },
      {
        id: "getting-started-file-types",
        title: "Supported File Types",
        content: (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { ext: ".pdb", desc: "Protein structure" },
              { ext: ".ali", desc: "Sequence alignment" },
              { ext: ".dat", desc: "Configuration data" },
              { ext: ".cif", desc: "Crystallographic info" },
              { ext: ".fasta", desc: "Sequence files" },
              { ext: ".zip", desc: "Archive files" },
            ].map((f) => (
              <div key={f.ext} className="p-3 bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-xl">
                <code className="text-sm font-mono font-medium text-[#6366F1]">{f.ext}</code>
                <p className="text-xs text-black/50 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
]

/* ─────────────────────────── sidebar nav item ─────────────────────────── */

function NavItem({
  section,
  isActive,
  activeSubId,
  onClickSection,
  onClickSub,
}: {
  section: DocSection
  isActive: boolean
  activeSubId: string
  onClickSection: () => void
  onClickSub: (id: string) => void
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onClickSection}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
          isActive
            ? "bg-white/60 shadow-sm"
            : "hover:bg-white/30"
        }`}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{ backgroundColor: isActive ? section.color : "rgba(0,0,0,0.05)", color: isActive ? "white" : "rgba(0,0,0,0.4)" }}
        >
          {section.icon}
        </div>
        <span
          className={`text-sm font-medium transition-colors duration-200 ${isActive ? "text-black/80" : "text-black/50"}`}
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {section.title}
        </span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-1 space-y-0.5 border-l border-black/10 pl-4">
              {section.subsections.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onClickSub(sub.id)}
                  className={`block w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                    activeSubId === sub.id
                      ? "text-black/80 font-medium bg-white/40"
                      : "text-black/40 hover:text-black/60 hover:bg-white/20"
                  }`}
                  style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────── mobile section selector ─────────────────────────── */

function MobileSectionSelector({
  sections,
  activeId,
  onChange,
}: {
  sections: DocSection[]
  activeId: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
            activeId === s.id
              ? "bg-white/70 shadow-sm text-black/80"
              : "bg-white/30 text-black/40 hover:bg-white/50"
          }`}
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: activeId === s.id ? s.color : "transparent", color: activeId === s.id ? "white" : "rgba(0,0,0,0.3)" }}
          >
            {s.icon}
          </div>
          {s.title}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────── main page ─────────────────────────── */

export default function DocumentationPage() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id)
  const [activeSubId, setActiveSubId] = useState(sections[0].subsections[0].id)
  const contentRef = useRef<HTMLDivElement>(null)

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0]

  const handleSectionClick = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (section) {
      setActiveSectionId(sectionId)
      setActiveSubId(section.subsections[0].id)
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubClick = (subId: string) => {
    setActiveSubId(subId)
    const el = document.getElementById(subId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Track active subsection on scroll
  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const handleScroll = () => {
      const subsectionEls = activeSection.subsections
        .map((sub) => ({ id: sub.id, el: document.getElementById(sub.id) }))
        .filter((item) => item.el !== null)

      for (let i = subsectionEls.length - 1; i >= 0; i--) {
        const rect = subsectionEls[i].el!.getBoundingClientRect()
        if (rect.top <= 200) {
          setActiveSubId(subsectionEls[i].id)
          break
        }
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [activeSection])

  const scrollToForm = () => {}

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F5F4F9] via-[#E8E3F0] to-[#DDD4E8]">
      {/* Header */}
      <Header onScrollToForm={scrollToForm} />

      {/* Main Layout */}
      <div className="pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-normal text-black/70 mb-2"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Documentation
            </h1>
            <p
              className="text-base text-black/40 max-w-2xl"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Everything you need to know about the GLACIER platform — tools, input files, pipeline, and getting started guides.
            </p>
          </div>

          {/* Mobile Section Selector */}
          <div className="lg:hidden mb-6">
            <MobileSectionSelector
              sections={sections}
              activeId={activeSectionId}
              onChange={handleSectionClick}
            />
          </div>

          {/* Two-Column Layout */}
          <div className="flex gap-8">
            {/* Sidebar — desktop only */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <SimplifiedGlassSurface borderRadius={20} blur={15} opacity={0.6} className="w-full">
                  <div className="p-4 w-full">
                    <p
                      className="text-[10px] uppercase tracking-[0.15em] text-black/30 font-semibold mb-3 px-3"
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                    >
                      Sections
                    </p>
                    {sections.map((section) => (
                      <NavItem
                        key={section.id}
                        section={section}
                        isActive={activeSectionId === section.id}
                        activeSubId={activeSubId}
                        onClickSection={() => handleSectionClick(section.id)}
                        onClickSub={handleSubClick}
                      />
                    ))}
                  </div>
                </SimplifiedGlassSurface>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <SimplifiedGlassSurface borderRadius={24} blur={20} opacity={0.7} className="w-full">
                <div
                  ref={contentRef}
                  className="w-full max-h-[calc(100vh-12rem)] overflow-y-auto"
                >
                  <div className="p-6 md:p-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: activeSection.color }}
                      >
                        <div className="text-white">{activeSection.icon}</div>
                      </div>
                      <div>
                        <h2
                          className="text-xl md:text-2xl font-semibold text-black/80"
                          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                        >
                          {activeSection.title}
                        </h2>
                      </div>
                    </div>
                    <p
                      className="text-sm text-black/50 mb-8 ml-[52px]"
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                    >
                      {activeSection.description}
                    </p>

                    {/* Subsections */}
                    <div className="space-y-10">
                      {activeSection.subsections.map((sub) => (
                        <div key={sub.id} id={sub.id} className="scroll-mt-8">
                          <h3
                            className="text-lg font-semibold mb-4"
                            style={{
                              fontFamily: "var(--font-geist-sans), sans-serif",
                              color: activeSection.color,
                            }}
                          >
                            {sub.title}
                          </h3>
                          <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                            {sub.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SimplifiedGlassSurface>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
