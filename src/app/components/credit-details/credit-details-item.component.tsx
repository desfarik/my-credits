import * as React from "react";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import AnimatedProgressProvider from "./animated-progress.provider";
import {easeQuadInOut} from 'd3-ease';
import './credit-details-item.style.scss'
import {Button, Typography} from "@material-ui/core";
import PeopleService from "../../service/people.service";

interface IProps {
    value: number,
    maxValue: number,
    name: string,
}

export class CreditDetailsItemComponent extends React.PureComponent<IProps> {
    render() {
        return <div className={'credit-details-item-wrapper'}>
            <div className={'credit-details-item'}>
                <Button></Button>
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={this.props.value}
                    duration={1.4}
                    easingFunction={easeQuadInOut}>
                    {(value: number) => {
                        const roundedValue = Math.round(value);
                        return (
                            <CircularProgressbar
                                maxValue={this.props.maxValue}
                                value={value}
                                text={`${roundedValue}`}
                                /* This is important to include, because if you're fully managing the
                          animation yourself, you'll want to disable the CSS animation. */
                                styles={buildStyles({
                                    pathTransition: "none",
                                    pathColor: PeopleService.getPersonColor(this.props.name)
                                })}
                            />
                        );
                    }}
                </AnimatedProgressProvider>
                <Typography className={'name'} variant="h5">
                    {this.props.name}
                </Typography>
            </div>
        </div>
    }
}