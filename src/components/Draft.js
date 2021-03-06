import React, { Component } from 'react';
import {CompositeDecorator, Editor, EditorState, RichUtils, convertToRaw} from 'draft-js';
import strategies from '../strategies';
import MentionSearch from './MentionSearch/MentionSearch';
import Hashtag from './Hashtag';
import Mention from './Mention';
import stateToMarkdown from '../utils/stateToMarkdown';

import 'draft-js/dist/Draft.css';

class Draft extends Component {
  constructor(props) {
    super(props);

    const MentionSearchComponent = (props) => (
      <MentionSearch {...props} editorState={this.state.editorState} updateEditorState={this.onChange}/>
    );

    const compositeDecorator = new CompositeDecorator([
      {
        strategy: strategies.handleStrategy,
        component: MentionSearchComponent
      }, {
        strategy: strategies.findMentionEntityStrategy,
        component: Mention
      }, {
        strategy: strategies.hashtagStrategy,
        component: Hashtag
      }
    ]);

    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator)
    };

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  logStateToConsole = () => {
    console.log(this.state.editorState.toJS());
  };

  logMarkdown = () => {
    console.log(stateToMarkdown(this.state.editorState.getCurrentContent()));
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <div style={styles.header}>
          <h1>A rich text editor</h1>
        </div>
        <div style={styles.content}>
          <div style={styles.editor} onClick={this.focus}>
            <Editor editorState={editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                    placeholder={'Write me something beautiful...'}
                    ref="editor"/>
          </div>
          <div style={styles.logButtonRow}>
            <button onClick={this.logStateToConsole}>Log state to console</button>
            <button onClick={this.logMarkdown}>Log markdown</button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  header: {
    textAlign: 'center'
  },
  content: {
    margin: '50px auto 100px auto',
    width: '400px'
  },
  editor: {
    padding: '5px',
    border: '1px solid grey'
  },
  logButtonRow: {
    marginTop: '20px'
  }
};

export default Draft;
