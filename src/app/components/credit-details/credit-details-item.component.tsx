import * as React from "react";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import AnimatedProgressProvider from "./animated-progress.provider";
import {easeQuadInOut} from 'd3-ease';
import './credit-details-item.style.scss'
import {Typography} from "@material-ui/core";
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
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={this.props.value}
                    duration={1.4}
                    easingFunction={easeQuadInOut}>
                    {(value: number) => {
                        const roundedValue = Math.round(value);
                        return (<React.Fragment>
                            <CircularProgressbar
                                // @ts-ignore
                                className={value > this.props.maxValue ? 'error' : ''}
                                maxValue={this.props.maxValue}
                                value={value}
                                text={`${roundedValue}`}
                                styles={buildStyles({
                                    pathTransition: "none",
                                    pathColor: PeopleService.getPersonColor(this.props.name)
                                })}
                            />
                            {this.props.children}
                        </React.Fragment>)

                    }}
                </AnimatedProgressProvider>
                <Typography className={'name'} variant="h5">
                    {this.props.name}
                </Typography>
            </div>
        </div>
    }
}