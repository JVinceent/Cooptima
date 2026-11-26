Read HANDOFF.md first, then look at the files in /reference and /assets.

Build the Cooptima mockup as a React app with Vite, TypeScript and React Router. Use plain CSS with CSS variables for the colors in HANDOFF.md. No UI library, no backend, no state library.

1. Create one shared layout per role: manager sidebar, buyer top bar, farmer bottom tabs, trucker header. Reuse a few simple components: Card, Button, StatusPill, AssistantTip (mascot + speech bubble).
2. Recreate every screen listed in HANDOFF.md so it looks like its reference file. Don't copy the .dc.html markup; write normal React.
3. Put all data in src/data/sample.ts, with the proposal figures and the sample placeholders clearly separated.
4. Add a start page linking to the four roles. Show phone screens in a 390px frame on desktop.
5. Copy /assets into public/assets.

Keep it simple. Don't write tests and don't add features that aren't in the reference screens. When you're done, tell me how to run it. I'll test it myself.
