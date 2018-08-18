
# Scales and Chords
Enriching my (novice and rudimentary) understanding of music theory by illustrating how to build a series of chords as successive triads of notes from a scale.

## Screenshot:
![screen shot 2018-08-15 at 8 55 07 pm](https://user-images.githubusercontent.com/29472568/44182693-98f91280-a0cd-11e8-9e44-8d3db3e0e288.png)

## Using Browserify and Watchify
- Instead of running `browserify in_file -o out_file` every time to recompile our script, we can use `watchify`.
- Run `watchify public/scripts/draw.js -o public/bundle.js -v` from the root (`-v` shows sparse logs).
- In a new terminal, run `npm start`. Now, any changes to `draw.js` are registered on page refresh.

## Next Steps
I've been using my sine wave [Dash app](https://github.com/zackstout/fourier-visualize-dash) to visualize how the waves carrying various tonal sounds align with one another. For instance, notes separated by a perfect fifth (such as C and G) have waves with frequencies in ratio 2:3.

The data seems to suggest that the lower the numbers in the fractional expression of the ratio between the frequencies of the two waves, the more pleasing the sound! The perfect fifth is 2:3, the perfect fourth is 3:4, the major third 4:5, the minor third 5:6 -- but then the theory breaks down at the major sixth, which seems to be 3:5, and the minor sixth, which looks to be either 4:7 or 5:9. Perhaps the ...sum of the numerator and denominator gives the measure of pleasantness of tonal sound? That would be odd...

Another idea is to save every chord progression to a database (every 3-, 4-, and 5-note chord from every scale -- A minor, A melodic minor, B major, ...). Then, for a given chord, we could find all the scales in which it appears as a triad (or quad-/pentad).

And that's not even taking into account different inversions (or "voicings"). We're also leaving out modes -- but I feel that's kind of an orthogonal issue, because changing the mode wouldn't change the underlying chord structure (or would it, by modulating the voicing?).

Ah, the secret of the frequency ratios isn't that deep: for the fifth, 7 semitones up, it's 2^(7/12) = 1.5; for the fourth, 5 semitones up, we have 2^(5/12) = 1.333. And we hear these ratios as pleasing because the waves line up (they line up better the smaller the integers we need to express the fraction, 3/2 or 4/3, etc.). Here's a rough picture of the relationship:

![screen shot 2018-08-18 at 4 36 38 pm](https://user-images.githubusercontent.com/29472568/44303376-f4f9ac00-a304-11e8-96e1-c10a7db88f41.png)
