import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err)
      return (
        <div style={{ padding: 24 }}>
          Router error: {String(this.state.err)}
        </div>
      );
    return this.props.children;
  }
}
