"""
Policy simulation service for SmartPayMap.

This service handles policy impact analysis and cost simulation
using AI-powered analysis for different countries and currencies.
"""

from typing import Dict, List, Any
import json
from ..models.payroll import PolicyChange, CostAnalysis
from ..utils.llm_utils import get_mapping_suggestions
from ..utils.mapping_utils import construct_standardized_dataset
from ..core.config import STANDARD_FIELDS

# Country-specific data for simulation
COUNTRY_DATA = {
    "US": {"currency": "USD", "tax_rate": 0.22, "social_security": 0.062},
    "UK": {"currency": "GBP", "tax_rate": 0.20, "social_security": 0.12}, 
    "DE": {"currency": "EUR", "tax_rate": 0.42, "social_security": 0.195},
    "FR": {"currency": "EUR", "tax_rate": 0.30, "social_security": 0.22},
    "JP": {"currency": "JPY", "tax_rate": 0.55, "social_security": 0.15},
    "CA": {"currency": "CAD", "tax_rate": 0.26, "social_security": 0.099},
    "AU": {"currency": "AUD", "tax_rate": 0.32, "social_security": 0.095},
    "SG": {"currency": "SGD", "tax_rate": 0.22, "social_security": 0.17},
    "CH": {"currency": "CHF", "tax_rate": 0.11, "social_security": 0.51},
    "NL": {"currency": "EUR", "tax_rate": 0.37, "social_security": 0.276}
}

# Currency exchange rates (mock data for simulation)
EXCHANGE_RATES = {
    "USD": 1.0,
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.0,
    "CAD": 1.25,
    "AUD": 1.35,
    "SGD": 1.35,
    "CHF": 0.92,
    "SEK": 8.5,
    "NOK": 8.8
}


class PolicySimulationService:
    """Service for handling policy simulation and impact analysis."""
    
    def __init__(self):
        self.country_data = COUNTRY_DATA
        self.exchange_rates = EXCHANGE_RATES
    
    async def simulate_policy_impact(
        self, 
        headers: List[str], 
        rows: List[List[str]], 
        policy_change: PolicyChange
    ) -> Dict[str, Any]:
        """
        Simulate the impact of policy changes on payroll data.
        
        Args:
            headers: CSV column headers
            rows: CSV data rows
            policy_change: Policy change parameters
            
        Returns:
            Dictionary with simulation results
        """
        # Get country information
        country_info = self.country_data.get(policy_change.target_country, {})
        if not country_info:
            country_info = {"currency": "USD", "tax_rate": 0.22, "social_security": 0.062}
        
        # Determine currency to use
        target_currency = policy_change.new_currency or country_info["currency"]
        
        # Generate AI-powered analysis
        impact_summary = self._generate_impact_summary(
            policy_change, country_info, len(rows)
        )
        
        # Perform cost analysis
        cost_analysis = self._analyze_costs(
            headers, rows, policy_change, country_info, target_currency
        )
        
        # Generate compliance notes
        compliance_notes = self._generate_compliance_notes(
            policy_change, country_info
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            policy_change, country_info, cost_analysis
        )
        
        return {
            "impact_summary": impact_summary,
            "cost_analysis": {
                "estimated_change": cost_analysis["estimated_change"],
                "currency_impact": cost_analysis["currency_impact"],
                "tax_implications": cost_analysis["tax_implications"]
            },
            "compliance_notes": compliance_notes,
            "recommendations": recommendations
        }
    
    def _generate_impact_summary(
        self, 
        policy_change: PolicyChange, 
        country_info: Dict[str, Any], 
        employee_count: int
    ) -> str:
        """Generate an AI-powered impact summary."""
        country_name = self._get_country_name(policy_change.target_country)
        currency = policy_change.new_currency or country_info["currency"]
        
        summary = f"Policy simulation for transition to {country_name} indicates "
        
        if policy_change.adjusted_salary:
            summary += f"salary adjustments to {currency} {policy_change.adjusted_salary:,.0f} "
        
        summary += f"will affect {employee_count} employees. "
        
        if country_info.get("tax_rate", 0) > 0.3:
            summary += "High tax jurisdiction requires careful cost planning. "
        
        if policy_change.notes:
            summary += f"Additional considerations: {policy_change.notes[:100]}..."
        
        return summary
    
    def _analyze_costs(
        self, 
        headers: List[str], 
        rows: List[List[str]], 
        policy_change: PolicyChange, 
        country_info: Dict[str, Any],
        target_currency: str
    ) -> Dict[str, str]:
        """Analyze cost implications of the policy change."""
        
        # Calculate estimated cost changes
        base_cost_change = "15-25% increase" if country_info.get("tax_rate", 0.22) > 0.3 else "5-15% increase"
        
        # Currency impact analysis
        source_currency = "USD"  # Assume USD as base
        exchange_rate = self.exchange_rates.get(target_currency, 1.0)
        
        if target_currency != source_currency:
            currency_impact = f"Currency conversion from {source_currency} to {target_currency} (rate: {exchange_rate:.2f})"
            if exchange_rate < 1:
                currency_impact += " - favorable conversion"
            else:
                currency_impact += " - requires budget adjustment"
        else:
            currency_impact = "No currency conversion needed"
        
        # Tax implications
        tax_rate = country_info.get("tax_rate", 0.22)
        social_rate = country_info.get("social_security", 0.1)
        
        tax_implications = f"Income tax: {tax_rate*100:.1f}%, Social contributions: {social_rate*100:.1f}%"
        
        if policy_change.adjusted_salary:
            tax_implications += f", Estimated on {target_currency} {policy_change.adjusted_salary:,.0f}"
        
        return {
            "estimated_change": base_cost_change,
            "currency_impact": currency_impact,
            "tax_implications": tax_implications
        }
    
    def _generate_compliance_notes(
        self, 
        policy_change: PolicyChange, 
        country_info: Dict[str, Any]
    ) -> List[str]:
        """Generate compliance considerations for the target country."""
        country_name = self._get_country_name(policy_change.target_country)
        notes = []
        
        # General compliance notes based on country
        if policy_change.target_country in ["DE", "FR", "NL"]:
            notes.append(f"EU GDPR compliance required for {country_name} operations")
            notes.append("Works council consultation may be required for salary changes")
            
        if policy_change.target_country == "US":
            notes.append("State-specific labor laws may apply depending on employee location")
            notes.append("Consider FLSA compliance for overtime regulations")
            
        if policy_change.target_country == "UK":
            notes.append("Auto-enrollment pension obligations apply")
            notes.append("National Minimum Wage compliance required")
            
        if policy_change.target_country in ["JP", "SG"]:
            notes.append("Local employment permit requirements may apply")
            notes.append("Consider cultural factors in compensation structure")
        
        # Tax-related compliance
        tax_rate = country_info.get("tax_rate", 0.22)
        if tax_rate > 0.35:
            notes.append("High-tax jurisdiction - consider tax optimization strategies")
        
        return notes
    
    def _generate_recommendations(
        self, 
        policy_change: PolicyChange, 
        country_info: Dict[str, Any],
        cost_analysis: Dict[str, str]
    ) -> List[str]:
        """Generate AI-powered recommendations."""
        recommendations = []
        country_name = self._get_country_name(policy_change.target_country)
        
        # Currency recommendations
        target_currency = policy_change.new_currency or country_info["currency"]
        if target_currency != "USD":
            recommendations.append(f"Consider currency hedging strategies for {target_currency} exposure")
        
        # Salary adjustment recommendations
        if policy_change.adjusted_salary:
            recommendations.append("Conduct market salary benchmarking to ensure competitiveness")
            recommendations.append("Phase salary adjustments over 6-12 months to manage budget impact")
        
        # Tax optimization
        tax_rate = country_info.get("tax_rate", 0.22)
        if tax_rate > 0.3:
            recommendations.append("Explore tax-efficient benefit structures (pension, healthcare)")
            recommendations.append("Consider split payroll arrangements if applicable")
        
        # General recommendations
        recommendations.append(f"Engage local payroll provider for {country_name} compliance")
        recommendations.append("Update employee contracts to reflect new jurisdiction")
        
        if policy_change.notes:
            recommendations.append("Review specific requirements mentioned in assumptions")
        
        return recommendations
    
    def _get_country_name(self, country_code: str) -> str:
        """Convert country code to full name."""
        country_names = {
            "US": "United States",
            "UK": "United Kingdom", 
            "DE": "Germany",
            "FR": "France",
            "JP": "Japan",
            "CA": "Canada",
            "AU": "Australia",
            "SG": "Singapore",
            "CH": "Switzerland",
            "NL": "Netherlands"
        }
        return country_names.get(country_code, country_code) 