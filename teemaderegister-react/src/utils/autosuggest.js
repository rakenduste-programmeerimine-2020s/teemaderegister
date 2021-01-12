import React from "react";
import Autosuggest from "react-autosuggest";

class AutoSuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
    };
  }

  //Testimiseks data
  tags = [
    {
      tag: "Voog",
    },
    {
      tag: "Taustauuring",
    },
    {
      tag: "Adobe",
    },
    {
      tag: "Fuse",
    },
    {
      tag: "CC",
    },
    {
      tag: "Apache",
    },
    {
      tag: "Spark",
    },
  ];

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : this.tags.filter(
          (tan) => tan.tag.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  getSuggestionValue = (suggestion) => suggestion.name;

  renderSuggestion = (suggestion) => (
    <div>
      {suggestion.name} | Founded in {suggestion.year}, {suggestion.origin}
    </div>
  );

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Type car name",
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggest;
