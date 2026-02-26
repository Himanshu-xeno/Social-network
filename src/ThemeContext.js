import React, { createContext, Component } from 'react';

export const ThemeContext = createContext();

export class ThemeProvider extends Component {
  constructor(props) {
    super(props);
    
    const savedTheme = localStorage.getItem('dchain-theme') || 'dark';
    
    this.state = {
      theme: savedTheme
    };
  }

  componentDidMount() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  toggleTheme = () => {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: newTheme });
    localStorage.setItem('dchain-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  render() {
    return (
      <ThemeContext.Provider value={{
        theme: this.state.theme,
        toggleTheme: this.toggleTheme
      }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}