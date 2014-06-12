# jquery.picturebar

## Introduction

...

## Basic usage

To initialize the iconfield on an existing textbox:
```javascript
$('#progress-bar').picturebar(
  'selectedImage': 'color.jpg',
  'unselectedImage': 'bw.jpg",
}
```

## Options

The following options are available:
<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Values</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>selectedImage</code></td>
      <td>The image to be displayed from the left edge of the bar to the point in the bar corresponding to the current percentage. May be string or canvas object.</td>
    </tr>
    <tr>
      <td><code>unselectedImage</code></td>
      <td>The image to be displayed from the point in the bar corresponding to the current percentage to the right edge of the bar. May be string or canvas object.</td>
    </tr>
    <tr>
      <td><code>percentage</code></td>
      <td>The current percentage value of the bar. An integer between 0 and 100. (Default: <code>0</code>)</td>
    </tr>
    <tr>
      <td><code>editable</code></td>
      <td>A boolean. If set to <code>true</code> the bar will by editable by the user, by clicking somewhere on the bar and selecting the percentage corresponding to the horizontal position of the click. (Default: <code>true</code></td>
    </tr>
    <tr>
  </tbody>
</table>

The iconfield's options may be set at initialization time.

To modify options after the iconfield has been created, the `option` method may be used.
```javascript
$('#process-bar').picturefield( 'option', {
  'percentage' : 50
} );
```

## Methods

The following methods are available:
### `refresh( )`
Re-style the picture bar. Must be called after changing one of the image parameters.

#### Parameters
None.

#### Usage
```javascript
$('#picture-bar').picturebar( 'refresh' );
```

### `option( name[, value] )`
Change or retrieve an iconfield option.

#### Parameters
`name` - the name of the option to get/set

`value` - the value to set

#### Usage
```javascript
$('#progress-bar').picturebar( 'option', 'percentage', 65 )
```
Alternatively, the method can also be called with a named map:

## Events

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>change.picturebar</code></td>
      <td>Triggered when the user clicks on the picture bar and changes the percentage value.</td>
    </tr>
  </tbody>
</table>
