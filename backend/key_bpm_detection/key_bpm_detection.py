import logging
import sys

import librosa
import numpy as np

from datatypes import Song_Key

logger = logging.getLogger(__name__)


def get_key(waveform: np.ndarray, sample_rate: int) -> Song_Key:
    """Returns the key of the song based on the chromagram of the song.
    Args:
        waveform (np.ndarray): The waveform of the song.
            - Can be obtained from librosa.load() for example.
            - It is recommended to use librosa.effects.hpss() to separate harmonic and percussive components

        sample_rate (int): How many samples per second the song has.

    Returns:
        Song_Key: The key of the song.
    """

    # A large portion of this algorithm is taken from https://github.com/jackmcarthur/musical-key-finder

    chromagraph = librosa.feature.chroma_cqt(
        y=waveform, sr=sample_rate, bins_per_octave=24
    )

    PITCHES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    # Results in a mapping of {pitch: frequency of pitch}
    key_freqs = {pitch: np.sum(chromagraph[idx]) for idx, pitch in enumerate(PITCHES)}

    # Constants for Krumhansl-Schmuckler key-finding algorithm
    maj_profile = np.asarray(
        [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
    )
    min_profile = np.asarray(
        [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
    )

    # Mapping of {pitch: correlation of chromagraph with the Krumhansl-Schmuckler profile}
    key_corr = {}

    for root_idx, root in enumerate(PITCHES):
        # for each pitch in pitches, tests whether using that note as the root of the key
        # gives a correlation with the Krumhansl-Schmuckler profile
        root_test = [
            key_freqs[PITCHES[(root_idx + offset) % len(PITCHES)]]
            for offset, _ in enumerate(PITCHES)
        ]

        # [1,0] represents correlation that root_test has to maj_profile
        key_corr[root + " Major"] = np.corrcoef(maj_profile, root_test)[1, 0]
        key_corr[root + " Minor"] = np.corrcoef(min_profile, root_test)[1, 0]

    for key in key_corr:
        logging.debug(f"Key {key} has a correlation of {key_corr[key]:.4f}")

    best_key = max(key_corr, key=key_corr.get)
    return Song_Key(best_key)


def get_key_from_path(filepath):
    waveform, sample_rate = librosa.load(filepath)

    # separate harmonic from percussive components of song
    waveform_harmonic, waveform_percussive = librosa.effects.hpss(waveform)

    return get_key(waveform_harmonic, sample_rate)


def get_bpm_from_path(filepath):
    waveform, sample_rate = librosa.load(filepath, duration=30)
    onset_env = librosa.onset.onset_strength(y=waveform, sr=sample_rate)
    tempo = librosa.feature.tempo(onset_envelope=onset_env, sr=sample_rate)
    return tempo.mean()


def main():
    # set level to logging.DEBUG to list key correlations
    logging.basicConfig(level=logging.WARNING)

    if len(sys.argv) <= 1:
        print(f"Usage: {sys.argv[0]}  <path to song file>")
        return

    song_key = get_key_from_path(sys.argv[1])
    song_bpm = get_bpm_from_path(sys.argv[1])

    print(f"Song Key: {song_key.value}")
    print(f"Song BPM: {song_bpm:.1f}")


if __name__ == "__main__":
    main()
