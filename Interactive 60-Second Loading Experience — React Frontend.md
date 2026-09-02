# Interactive 60-Second Loading Experience — React Frontend

Build a polished, production-quality interactive frontend using **React + Vite + JavaScript + CSS**.

## Core Concept

Create a cinematic **60-second interactive loading experience**. The user should never feel like they are simply waiting. The entire 60 seconds should be an interactive experience centered around a **large magical/futuristic hourglass**.

The experience represents the user breaking through an obstacle while the hourglass counts down. At exactly 60 seconds, the hourglass automatically cracks and breaks, revealing the final state.

## Visual Style

Use a premium cinematic/futuristic visual style:
- Dark background
- High-quality typography
- Glassmorphism where appropriate
- Subtle atmospheric particles
- Soft glow effects
- Realistic-looking sand and rock
- Smooth animations
- Strong depth and lighting
- Minimal, clean interface
- No clutter
- Responsive design

Do NOT make it look like a generic loading spinner or ordinary progress bar.

## Initial Screen

At page load:
- Place the website logo in the **top-left corner**.
- The main hourglass initially starts on the **right side of the screen**.
- Animate the hourglass **rolling/moving from right to left toward the center**.
- It should smoothly settle in the center of the viewport.
- The entrance animation should feel cinematic and intentional.
- After the entrance animation, start the 60-second loading experience.

## Hourglass

The hourglass is the main visual element.

It must contain:
- A top chamber containing sand
- A bottom chamber receiving the falling sand
- A rock/obstacle associated with the loading experience
- Continuous sand-flow animation
- Realistic-looking sand movement
- Subtle glass reflections/highlights
- Subtle floating particles around it

The hourglass itself must act as the primary visual progress indicator.

As time passes:
- Top sand decreases
- Bottom sand increases
- Sand continuously flows through the center
- The visual state must correspond to the actual elapsed time

## 60-Second Timer

The loading experience must last **exactly 60 seconds**.

Use elapsed-time-based timing rather than simply incrementing a counter every second.

Requirements:
- Start timer only after the entrance sequence is complete.
- Track actual elapsed time.
- Display remaining time subtly as `60`, `59`, `58`, etc.
- Progress must reach 100% at exactly 60 seconds.
- Do not allow the experience to finish early.
- Do not allow it to remain stuck after 60 seconds.
- Account for browser timer delays by calculating progress from timestamps.

At 60 seconds:
- Stop all loading interactions.
- Trigger the final hourglass destruction animation.
- Reveal the completion screen.

## Rock Interaction

The user must have a **rock-breaker tool/hammer**.

The tool should visually appear to be controlled by the user's cursor.

Interaction:
- Move mouse → hammer follows the cursor naturally.
- Move over the rock → indicate that the rock can be hit.
- Click → hammer swings toward the rock.
- The rock reacts to every successful hit.

Do NOT make the hammer just a normal HTML button.

The interaction should feel physical.

## Rock Damage System

The rock should require multiple hits.

Example progression:
1. First hit → small crack
2. Second hit → additional cracks
3. Third/fourth hits → larger cracks
4. More hits → rock becomes increasingly damaged
5. Final hit → rock breaks into pieces

Use visual effects:
- Crack overlays
- Small rock particles
- Impact particles
- Hammer recoil
- Small screen/camera shake
- Dust effect
- Subtle sound hooks if audio is implemented

The user should clearly understand that their interaction is affecting the rock.

## Hit Feedback

Every successful hit should provide immediate feedback.

Examples:
- `HIT`
- `PERFECT HIT`
- Combo indicator
- Crack animation
- Impact particles
- Small vibration/shake effect

Avoid excessive effects that make the interface visually noisy.

## Combo / Score

Add a lightweight interaction score.

Track:
- Number of hits
- Successful hits
- Combo count
- Rock damage level

Example UI:

`HITS 08`
`COMBO ×4`

Keep this information secondary so that the hourglass remains the main focus.

## Dynamic Loading Messages

Display changing system/status messages during the 60 seconds.

Examples:

- `INITIALIZING SYSTEM...`
- `CALIBRATING CORE...`
- `SYNCHRONIZING MODULES...`
- `PROCESSING DATA...`
- `STABILIZING ENVIRONMENT...`
- `FINALIZING...`

Messages should change smoothly using fade/slide transitions.

Do not change messages randomly every frame.

## Background

Create a subtle animated environment:
- Dark atmospheric background
- Moving particles
- Soft light/glow
- Subtle depth/parallax
- Very slow background movement

The background should become slightly more intense as the timer approaches zero.

## Easter Egg

Include at least one hidden Easter egg.

Example:
- Clicking the logo multiple times reveals a hidden message.
- Or interacting with a hidden area of the hourglass reveals something.

The Easter egg should not interfere with the primary experience.

Example result:

`SECRET PROTOCOL DISCOVERED`

Make the Easter egg visually polished.

## Final 10 Seconds

This is the most important cinematic sequence.

At exactly **10 seconds remaining**, the hourglass begins to crack automatically.

The user must NOT break the hourglass with the hammer.

The hammer is ONLY for breaking the rock.

### 10–7 seconds
- First small cracks appear on the hourglass glass.
- Subtle vibration begins.
- Sand continues falling normally.

### 7–4 seconds
- More cracks appear.
- Cracks spread across the glass.
- Hourglass shakes slightly more.
- Lighting/glow becomes more intense.

### 4–1 seconds
- Heavy visible cracking.
- Stronger shaking.
- Glass appears unstable.
- Sand flow becomes visually dramatic.
- Countdown becomes prominent.

### At exactly 0 seconds
Automatically:
- Stop the timer.
- Stop normal loading interactions.
- Break the hourglass.
- Animate glass fragments moving outward/downward.
- Release/disperse the remaining sand.
- Remove the hammer interaction.
- Transition into the completion screen.

The hourglass breaking should feel like the climax of the entire 60-second experience.

## Final Screen

After the hourglass breaks, display a polished completion state.

Example:

`SYSTEM READY`

`60 SECONDS COMPLETE`

Show:
- Final hit count
- Best combo
- Optional discovered Easter egg status
- A primary button such as `ENTER EXPERIENCE`

Use a smooth transition rather than immediately replacing the entire page.

## Responsive Design

The UI must work on:
- Desktop
- Laptop
- Tablet
- Mobile

On mobile:
- Replace cursor-following hammer behavior with touch interaction.
- Make the rock easy to interact with.
- Keep the hourglass centered.
- Maintain the visual hierarchy.

## Accessibility

Implement:
- Keyboard-accessible controls where possible
- Visible focus states
- Proper button labels
- Good text contrast
- `prefers-reduced-motion` support
- Do not rely exclusively on color for feedback

## Performance

The experience contains many animations, so optimize it carefully.

Requirements:
- Maintain smooth animations.
- Prefer CSS transforms/opacity for animations.
- Use `requestAnimationFrame` for custom animation loops where appropriate.
- Avoid unnecessary React re-renders.
- Clean up timers, animation frames, and event listeners.
- Do not create huge numbers of DOM elements for particles.

## React Architecture

Use reusable React components.

Suggested structure:

src/
  components/
    LoadingExperience.jsx
    Hourglass.jsx
    SandAnimation.jsx
    Rock.jsx
    Hammer.jsx
    ProgressDisplay.jsx
    StatusMessage.jsx
    ParticleBackground.jsx
    EasterEgg.jsx
    CompletionScreen.jsx

  hooks/
    useTimer.js
    useInteraction.js

  styles/
    global.css
    loading.css
    hourglass.css
    rock.css
    animations.css
    completion.css

  App.jsx
  main.jsx

You may modify the structure if a better architecture is appropriate.

## State Management

Maintain clean state for:
- Loading status
- Elapsed time
- Remaining time
- Progress
- Rock damage
- Hit count
- Combo
- Easter egg state
- Final animation state

Avoid unnecessary global state libraries. React state/hooks are sufficient unless there is a strong reason otherwise.

## Important Timing Rule

The complete experience must have a reliable 60-second timeline.

Use a timestamp-based calculation such as:

`elapsed = currentTime - startTime`

and derive:

`progress = elapsed / 60000`

Clamp progress between 0 and 1.

The final completion event must occur when elapsed time reaches 60 seconds.

The entrance animation should NOT accidentally consume part of the 60-second loading timer unless explicitly intended.

## Animation Quality

Prioritize:
- Smooth easing
- Natural movement
- Layered animations
- Subtle motion
- Physical-looking interactions
- Cinematic transitions

Avoid:
- Excessive bouncing
- Random flashy effects
- Generic spinners
- Cheap-looking gradients
- Excessive text
- Unnecessary UI panels

## Deliverable

Create the complete runnable React/Vite frontend.

It must:
1. Start with the logo in the top-left.
2. Animate the hourglass from right → center.
3. Start the exact 60-second experience.
4. Animate sand continuously.
5. Allow the user to break the rock with the hammer.
6. Provide hit feedback and progressive rock damage.
7. Display dynamic loading messages.
8. Include an Easter egg.
9. Begin hourglass cracking automatically at 10 seconds remaining.
10. Automatically break the hourglass at exactly 60 seconds.
11. Reveal the final completion screen.
12. Work responsively.
13. Have polished animations and professional UI/UX.
14. Run without backend/API requirements.

Before finishing, test the complete 60-second flow and ensure there are no console errors, broken interactions, layout issues, or timer synchronization problems.