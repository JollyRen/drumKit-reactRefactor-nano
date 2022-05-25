# Drum Kit React Refactor Using Nano-React-App

- [The Premise](https://github.com/JollyRen/drumKit-reactRefactor-nano#the-premise)
- [The Project](https://github.com/JollyRen/drumKit-reactRefactor-nano#the-project)
    - [onKeyDown Blues](https://github.com/JollyRen/drumKit-reactRefactor-nano#onkeydown-blues)
    - ["Play It Sam"](https://github.com/JollyRen/drumKit-reactRefactor-nano#play-it-sam)
    - [Initiating Players and Audio](https://github.com/JollyRen/drumKit-reactRefactor-nano#initiating-players-and-audio)
- [Outro](https://github.com/JollyRen/drumKit-reactRefactor-nano#outro)

## The Premise

first off, I want to point out that this project is from the 30 Javascript apps in 30 days challenge / course from Wes Bos which you can [find here](https://javascript30.com/).

While Wes Bos' original project is a very straightforward and concise app, I'm on a journey to go through the course using nano-react-app or create-react-app to convert these usually small projects into a framework.

Yes, it's impractical. No, the projects don't warrant the overhead of all the boilerplate. Yes, I will likely go back through and do the projects in MUI or Tailwind CSS for practice.

And that's the crux of it. Practice. It's practice while I'm between projects and work. ABC and keep sharp!

Now onto the project!

## The Project

This project focuses around two main parts:
- Animation using class changes
- playing audio on key presses

### onKeyDown Blues

Let's focus on playing audio on keypress first. Without getting the event listener for key press to work, nothing works.

The tool we need to use for this is called `onKeyDown` (or you could use `onKeyUp`, `onKeyPress`, but there are reasons for `keyDown` instead, that I'll get to later). `onKeyDown` is typically used for input fields, and in this use case, isn't anything special In fact, there's [hardly any documentation](https://reactjs.org/docs/events.html#keyboard-events) on it whatsoever in the React docs under `SyntheticEvent -> Keyboard Events`.

From the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex), here's what it does:
> A negative value (usually tabindex="-1") means that the element is not reachable via sequential keyboard navigation, but could be focused with JavaScript or visually by clicking with the mouse. It's mostly useful to create accessible widgets with JavaScript.

`tabindex=0` or `tabindex=-1` are both sufficient for our use, but we don't really want the divs or tags being focused or reachable by keyboard nav. It's really interesting to take a look at if you're looking for keyboard navigation in your app, though and I highly recommend taking time to read the MDN.

This `tabIndex={-1}` solution ended up being my hacky way to get this otherwise input-field-focused event to occur.

Now that the major issue is out of the way, we can move onto the more visible but much simpler issues of changing class names dynamically to initiate animation and getting audio to play.

### "Play It Sam"

The CSS takes care of transitions at 0.7s. Instead of doing a setTimeout() of an equal time (subject to async stack blocks in a real app), it's much better to capture an event as it happens. Remember, active user events are not the only events that fire. There are plenty of other events going on like mouse movement (capturing x and y values), focus, active time on page, onLoad, onUnload, etc. The events fire for them whether we listen for them or not, so why not use them?

In this case, we're using `transitionend` events to listen for when our CSS transition has finished (0.7s) and then it gets caught by the div that transitioned to fire a transition callback.

```jsx

const { keyPress, keyEl } = props.props //props passed down from main div on App entrypoint
                                        //to parent, to "Key" child component

const [isPlaying, setIsPlaying] = useState('key')  //isPlaying toggle, dynamic class name
const handleTransition = () => setIsPlaying('key') //handles changing isPlaying back to
                                                   //original class name once transitionEnd fires.

useEffect(
  () =>
    keyPress == code                //keypress value matches keycode of event(num vs string)
      ? (
        audio.currentTime = 0,      //reset audio on corresponding keycode
                                    //otherwise it will play until the end without firing again
        audio.play(),               //play audio
        setIsPlaying('key playing') //set isPlaying to 'key playing' to trigger transition
        )
      : null,
[keyPress]                          //listen for keypress changes
                                    //(keypress fires keycode, then immediately is reset to '')
)

<div data-key={code} className={isPlaying} onTransitionEnd={handleTransition}></div>

```
I've abstracted the component to show the most crucial parts of the transition scheme, with a bonus of getting audio to play. As you can see, we reset the current time before `audio.play()` fires. This is because if we don't, it won't play again if it's already playing.

The last thing to change in the ternary callback is to set the class to trigger the transition.

In the `div` tag you see we've set the `className` to `isPlaying` constant. This state gets managed by the `onTransitionEnd` callback function, `handleTransition` which has one job: `setIsPlaying('key')`

### Initiating Players and Audio

Initially, I thought about starting a new player or source for each audio as a separate component, similar to the Wes Bos tut. Instead I thought "Why map twice?" It just didn't make sense to be mapping the same keyMap elements so many times. There surely is a better way.

As I instantiate through the `Key` component in the `Keys` component map, I also have an interesting little `setState`:

```jsx

const [soundName, setSoundName] = useState(keyEl.sound)
const [audio, setAudio] = useState(new Audio(`./src/sounds/${soundName}.wav`))

  <div data-key={code} className={isPlaying} onTransitionEnd={handleTransition}>
    <kbd>{letter.toUpperCase()}</kbd>
    <span className="sound">{soundName}</span>
  </div>

```

in the `div` you'll notice something. There's no div for the audio. So where is it? The `audio` constant above is set to a file on Component instantiation, based on the name of the sound of the key, taken from the keyMap data given to the map in `Keys`. `soundName` is used for the `<span>` but also in the `.wav` file and path, dynamically.

The resulting `Audio()` object, if you console log it, comes through as an `<audio>` tag, complete with the url, and other attributes. But it has tons of other stuff on it too, including the method `.play()` through the [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement) which is itself an extension of the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)

we also use the `.currentTime` property to reset the time to 0, if you recall. Definitely take a look at this, if you're ever using any content. This includes `.mp4` files or `.webp` that you want to loop and autoplay instead of `GIF` files. These files are being used for their higher fidelity and smaller size than the uncompressed `.gif` that offers lower resolution and much higher file size.

What you put into the `Audio()` goes to `.currentSrc` for the resulting `<audio>` tag. That HTML gets displayed on a `console.log` and it's pretty hard to get to the methods and properties on the resulting `new Audio()` object.

## Outro

This was a fun project, and I plan on doing more with it eventually. Changing the background, adding a history and timeline with the option of recording drum loops. Let's see what happens.

For now, onto the next project! Adios and see you in the next one!
