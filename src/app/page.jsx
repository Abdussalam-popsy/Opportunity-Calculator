"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ThemeToggle } from "@/components/themeToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function OpportunityCalculator() {
  // State for baseline data (user's goals and current situation)
  const [baselineData, setBaselineData] = useState({
    goalAmount: 0,
    timeframeWeeks: 4,
    availableHoursPerWeek: 20,
    currentHourlyRate: 0,
  });

  // State for opportunity data (details about the potential opportunity)
  const [opportunityData, setOpportunityData] = useState({
    name: "Add opportunity here",
    offeredAmount: 0,
    requiredHours: 0,
    timeframeWeeks: 4,
    serendipityPercent: 20, // Default 20% serendipity
    additionalBenefits: 0,
  });

  // Function to calculate baseline metrics
  const calculateBaseline = () => {
    const weeklyTarget = baselineData.goalAmount / baselineData.timeframeWeeks;
    const requiredHourlyRate =
      weeklyTarget / baselineData.availableHoursPerWeek;

    const result = {
      weeklyTarget,
      requiredHourlyRate,
      currentProjection:
        baselineData.currentHourlyRate *
        baselineData.availableHoursPerWeek *
        baselineData.timeframeWeeks,
    };
    console.log("Baseline calculation:", result);
    return result;
  };

  // Function to calculate the value with serendipity factor
  const calculateSerendipityValue = () => {
    const baseValue = opportunityData.offeredAmount;
    const serendipityMultiplier = 1 + opportunityData.serendipityPercent / 100;
    const result = baseValue * serendipityMultiplier;
    console.log("Serendipity value:", result);
    return result;
  };

  // Function to calculate opportunity metrics
  const calculateOpportunity = () => {
    const baseline = calculateBaseline();
    const opportunityWeeklyRate =
      opportunityData.offeredAmount / opportunityData.timeframeWeeks;
    const opportunityHourlyRate =
      opportunityWeeklyRate / opportunityData.requiredHours;

    const potentialValue = calculateSerendipityValue();
    const movementTowardGoal = potentialValue / baselineData.goalAmount;
    const effortRatio =
      opportunityData.requiredHours /
      (baselineData.availableHoursPerWeek * baselineData.timeframeWeeks);
    const opportunityProfit = movementTowardGoal - effortRatio;

    const result = {
      hourlyRate: opportunityHourlyRate,
      totalProjection: opportunityData.offeredAmount,
      potentialWithSerendipity: potentialValue,
      opportunityProfit,
      remainingHours:
        baselineData.availableHoursPerWeek - opportunityData.requiredHours,
      exceedsGoalBy: potentialValue - baselineData.goalAmount,
    };
    console.log("Opportunity calculation:", result);
    return result;
  };

  const generateChartData = () => {
    const baseline = calculateBaseline();
    const opportunity = calculateOpportunity();
    const serendipityValue = calculateSerendipityValue();

    return Array.from(
      { length: baselineData.timeframeWeeks + 1 },
      (_, week) => ({
        week: `Week ${week}`,
        baseline: baseline.weeklyTarget * week,
        opportunity:
          (opportunity.totalProjection / baselineData.timeframeWeeks) * week,
        withSerendipity:
          (serendipityValue / baselineData.timeframeWeeks) * week,
        goal: baselineData.goalAmount,
      })
    );
  };

  // Memoize the calculation results
  const baselineResults = useMemo(() => calculateBaseline(), [baselineData]);
  const opportunityResults = useMemo(
    () => calculateOpportunity(),
    [opportunityData, baselineData]
  );
  const serendipityValue = useMemo(
    () => calculateSerendipityValue(),
    [opportunityData]
  );

  useEffect(() => {
    console.log("BaselineData:", baselineData);
    console.log("OpportunityData:", opportunityData);
  }, [baselineData, opportunityData]);

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="calculator" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="calculations">
              Detailed Calculations
            </TabsTrigger>
          </TabsList>

          <div className="">
            <ThemeToggle />
          </div>
        </div>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="md:flex gap-6">
                {/* Inputs*/}
                <div className="md:w-1/2 space-y-8">
                  {/* Baseline Goals Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Your Baseline Goals</h3>
                    <div>
                      <Label>Target Amount ($)</Label>
                      <Input
                        type="number"
                        value={baselineData.goalAmount}
                        onChange={(e) =>
                          setBaselineData((prev) => ({
                            ...prev,
                            goalAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Available Hours (weekly)</Label>
                      <Input
                        type="number"
                        value={baselineData.availableHoursPerWeek}
                        onChange={(e) =>
                          setBaselineData((prev) => ({
                            ...prev,
                            availableHoursPerWeek:
                              parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Current Hourly Rate ($)</Label>
                      <Input
                        type="number"
                        value={baselineData.currentHourlyRate}
                        onChange={(e) =>
                          setBaselineData((prev) => ({
                            ...prev,
                            currentHourlyRate: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Opportunity Details Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Opportunity Details</h3>
                    <div>
                      <Label>Opportunity Name</Label>
                      <Input
                        value={opportunityData.name}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Offered Amount ($)</Label>
                      <Input
                        type="number"
                        value={opportunityData.offeredAmount}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            offeredAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Required Hours (weekly)</Label>
                      <Input
                        type="number"
                        value={opportunityData.requiredHours}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            requiredHours: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Graph and chart */}
                <div className="md:w-1/2 space-y-8">
                  {/* Serendipity Section */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold">Serendipity Factor</h3>
                    <div className="space-y-2">
                      <Label>
                        Serendipity Percentage (
                        {opportunityData.serendipityPercent}%)
                      </Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          value={[opportunityData.serendipityPercent]}
                          max={100}
                          step={5}
                          className="flex-1"
                          onValueChange={(value) =>
                            setOpportunityData((prev) => ({
                              ...prev,
                              serendipityPercent: value[0],
                            }))
                          }
                        />
                        <span className="w-12 text-right">
                          {opportunityData.serendipityPercent}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {opportunityData.serendipityPercent < 20
                          ? "Conservative estimate - minimal network effects"
                          : opportunityData.serendipityPercent < 50
                          ? "Moderate potential for additional opportunities"
                          : "High potential for compound benefits and opportunities"}
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="goal"
                          stroke="#888888"
                          name="Goal"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="baseline"
                          stroke="#9333ea"
                          name="Current Trajectory"
                        />
                        <Line
                          type="monotone"
                          dataKey="opportunity"
                          stroke="#10B981"
                          name="Base Opportunity"
                        />
                        <Line
                          type="monotone"
                          dataKey="withSerendipity"
                          stroke="#3B82F6"
                          name="With Serendipity"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-gray-500">Base Value</div>
                      <div className="text-xl font-semibold">
                        ${opportunityData.offeredAmount.toLocaleString()}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-500">
                        With Serendipity
                      </div>
                      <div className="text-xl font-semibold">
                        ${serendipityValue.toLocaleString()}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-500">
                        Opportunity Profit
                      </div>
                      <div className="text-xl font-semibold">
                        {(opportunityResults.opportunityProfit * 100).toFixed(
                          1
                        )}
                        %
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Baseline Calculations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Weekly Target:</div>
                    <div>${baselineResults.weeklyTarget.toFixed(2)}</div>
                    <div>Required Hourly Rate:</div>
                    <div>
                      ${baselineResults.requiredHourlyRate.toFixed(2)}/hour
                    </div>
                    <div>Current Trajectory:</div>
                    <div>${baselineResults.currentProjection.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Opportunity Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Effective Hourly Rate:</div>
                    <div>${opportunityResults.hourlyRate.toFixed(2)}/hour</div>
                    <div>Total Projection:</div>
                    <div>${opportunityResults.totalProjection.toFixed(2)}</div>
                    <div>With Serendipity:</div>
                    <div>
                      ${opportunityResults.potentialWithSerendipity.toFixed(2)}
                    </div>
                    <div>Opportunity Profit:</div>
                    <div>
                      {(opportunityResults.opportunityProfit * 100).toFixed(1)}%
                    </div>
                    <div>Remaining Weekly Hours:</div>
                    <div>{opportunityResults.remainingHours} hours</div>
                    <div>Goal Difference:</div>
                    <div
                      className={
                        opportunityResults.exceedsGoalBy >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ${opportunityResults.exceedsGoalBy.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// it's been an adventure
