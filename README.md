# @spynejs/cms

@spynejs/cms is the **official CMS runtime plugin for SpyneJS**.

It provides a **WYSIWYG data authoring layer** for SpyneJS applications, enabling live editing of **structured JSON data** directly inside a running app — without modifying application code.

The CMS operates strictly on **application data**, preserving SpyneJS’s explicit View–Behavior–Logic architecture while enabling structured collaboration between developers, content authors, and AI-assisted workflows.

---

## What this is

- A **CMS runtime plugin**, not a standalone application
- Designed to run **inside SpyneJS applications**
- Enables WYSIWYG editing of structured JSON data
- Uses **deterministic, path-based updates**
- Built to support **human + AI copy / revise / validate workflows**

This package represents the **runtime CMS layer** of the SpyneJS platform.  
Persistence, file access, and environment-specific behavior are handled by separate adapter packages.

---

## Who this is for

- Developers building SpyneJS applications that use structured JSON data
- Teams that want **safe, local-first content editing** during development
- Projects that require **explicit control over behavior wiring**
- AI-assisted authoring workflows that must remain deterministic and auditable

---

## How it fits into SpyneJS

SpyneJS applications treat **data, behavior, and rendering as distinct concerns**.

@spynejs/cms integrates at the **data layer only**:
- It tracks deterministic paths through application data
- Reflects edits live in the running application
- Stages changes without mutating application logic or templates

All behavior wiring, rendering logic, and application structure remain **fully controlled by the developer**.

---

## AppBuilder-generated applications

No setup required.

All AppBuilder-generated SpyneJS applications automatically:
- Load the CMS runtime plugin
- Pipe supported data sources through the CMS layer
- Enable WYSIWYG editing for local JSON data

---

## Custom SpyneJS applications

### 1. Register the CMS plugin

```js
SpyneApp.registerPlugin(spyneCmsPlugin);
```

---

### 2. Pipe fetched data through the CMS mapper

When registering a fetch channel, route fetched data through the CMS mapping function:

```js
SpyneApp.registerChannel(
  new ChannelFetch("MY_JSON_DATA", {
    url: myJSONDataURL,
    map: SpyneApp.pluginsFn.mapCmsData,
  }),
);
```

This allows the CMS to:
- Track deterministic data paths
- Associate UI edits with source data
- Stage changes safely before persistence

---

## Local JSON editing (adapter required)

To edit **local JSON files**, an environment adapter must also be installed and running.

The adapter is responsible for:
- Reading JSON files from disk
- Applying path-based updates
- Writing updated JSON files
- Creating timestamped backups

👉 See **@spynejs/cms-adapter** for installation and setup details.

---

## Release status

This package represents the **first public release** of the SpyneJS CMS runtime plugin.

It has been developed and used internally as a **private package for over two years** across production SpyneJS applications before being prepared for public release.

The current release focuses on a **stable, intentionally scoped feature set**:
- WYSIWYG authoring of structured JSON data
- Deterministic, path-based updates
- Safe integration with the SpyneJS runtime

The CMS will continue to evolve as part of the broader SpyneJS authoring platform, with future expansions including additional adapters, deeper tooling integration, and AI-assisted workflows.

---

## Scope & roadmap

**Current**
- WYSIWYG editing of structured JSON data
- Automatic integration with AppBuilder apps
- Manual integration with custom SpyneJS apps
- Deterministic, path-based update model

**Planned**
- Adapters for additional data sources (SQL, NoSQL, headless CMS)
- Deeper integration with Spyne Studio
- AI-assisted content editing and validation

---

## Important notes

- This CMS **does not edit JavaScript, HTML, or SCSS**
- It operates strictly on application data
- All behavior wiring remains explicit and controlled by the application

---

## License & ownership

© Relevant Context, Inc. All rights reserved.

This software is part of the SpyneJS platform and is developed and maintained by Relevant Context, Inc., a Delaware C-Corporation.

The final open-source license for this package has **not yet been designated**.  
Until a license is explicitly published:

- This code is provided for evaluation and authorized use only
- Redistribution, modification, or commercial reuse may be restricted
- Certain functionality may require authentication or an active subscription

Parts of the SpyneJS CMS ecosystem — including runtime behavior, server-side plugins, and premium tooling — may be distributed separately under different terms.

A formal license (likely GPL-3.0 or a dual-license model) will be announced prior to public open-source release.
