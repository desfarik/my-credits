import * as React from "react";
import {Animate} from "react-move";

interface IProps {
    valueStart: number,
    valueEnd: number,
    duration: number,
    easingFunction: (normalizedTime: number) => number;
}

export default class AnimatedProgressProvider extends React.PureComponent<IProps> {

    private interval: number;

    state = {
        isAnimated: false
    };

    static defaultProps = {
        valueStart: 0
    };

    componentDidMount() {
        this.setState({
            isAnimated: !this.state.isAnimated
        });

    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        return (
            <Animate
                start={() => ({
                    value: this.props.valueStart
                })}
                update={() => ({
                    value: [
                        this.state.isAnimated ? this.props.valueEnd : this.props.valueStart
                    ],
                    timing: {
                        duration: this.props.duration * 1000,
                        ease: this.props.easingFunction
                    }
                })}
            >
                {({value}) => this.props.children(value)}
            </Animate>
        );
    }
}
